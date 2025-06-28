<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
   public function index(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        $query = User::query();

        // Apply filters
        if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('first_name', 'like', "%{$search}%")
            ->orWhere('last_name', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%");
        });
    }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('is_available')) {
            $query->where('is_available', $request->boolean('is_available'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Apply sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        $allowedSorts = ['name', 'email', 'created_at', 'role']; // Updated to match your fields
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        }

        // Handle pagination with dynamic page size
        $perPage = $request->get('per_page', 15);
        $allowedPerPage = [10, 25, 50, 100];
        if (!in_array($perPage, $allowedPerPage)) {
            $perPage = 15; // Default fallback
        }

        $users = $query->paginate($perPage)->withQueryString();

        $stats = [
            'total_users' => User::count(),
            'customers' => User::where('role', 'customer')->count(),
            'admins' => User::where('role', 'admin')->count(),
            'verified_users' => User::whereNotNull('email_verified_at')->count(),
            'new_this_month' => User::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];

        return Inertia::render('admin/Users/index', [ 
            'users' => $users->through(function ($user) {
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                ];
            }),
            'stats' => $stats,
            'filters' => $request->only([
                'search', 'role', 'is_available', 
                'date_from', 'date_to', 'sort', 'direction', 'per_page'
            ]),
        ]);
    }

    public function show($id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        $user = User::findOrFail($id);

        // Get delivered status ID
        $deliveredStatus = \App\Models\OrderStatus::where('name', 'Delivered')->first();
        $deliveredStatusId = $deliveredStatus ? $deliveredStatus->id : 6; // Fallback to 6 based on seeder

        // Get user statistics if customer
        $userStats = [];
        if ($user->role === 'customer') {
            $userStats = [
                'total_orders' => DB::table('food_orders')->where('customer_id', $id)->count(),
                'completed_orders' => DB::table('food_orders')
                    ->where('customer_id', $id)
                    ->where('order_status_id', $deliveredStatusId)
                    ->count(),
                'total_spent' => DB::table('food_orders')
                    ->where('customer_id', $id)
                    ->where('order_status_id', $deliveredStatusId)
                    ->sum('total_amount'),
                'average_order_value' => DB::table('food_orders')
                    ->where('customer_id', $id)
                    ->where('order_status_id', $deliveredStatusId)
                    ->avg('total_amount'),
                'favorite_restaurants' => DB::table('food_orders')
                    ->join('restaurants', 'food_orders.restaurant_id', '=', 'restaurants.id')
                    ->select('restaurants.restaurant_name', DB::raw('COUNT(*) as order_count'))
                    ->where('food_orders.customer_id', $id)
                    ->groupBy('restaurants.id', 'restaurants.restaurant_name')
                    ->orderBy('order_count', 'desc')
                    ->limit(5)
                    ->get(),
            ];

            // Recent orders
            $recentOrders = DB::table('food_orders')
                ->join('restaurants', 'food_orders.restaurant_id', '=', 'restaurants.id')
                ->join('order_statuses', 'food_orders.order_status_id', '=', 'order_statuses.id')
                ->select(
                    'food_orders.id',
                    'food_orders.total_amount',
                    'food_orders.created_at',
                    'restaurants.restaurant_name',
                    'order_statuses.name as status'
                )
                ->where('food_orders.customer_id', $id)
                ->orderBy('food_orders.created_at', 'desc')
                ->limit(10)
                ->get();

            $userStats['recent_orders'] = $recentOrders;
        }

        // Get user addresses
        $addresses = DB::table('customer_addresses')
            ->join('addresses', 'customer_addresses.address_id', '=', 'addresses.id')
            ->join('countries', 'addresses.country_id', '=', 'countries.id')
            ->select(
                'addresses.*',
                'countries.country_name',
            )
            ->where('customer_addresses.customer_id', $id)
            ->get();

        return Inertia::render('admin/Users/show', [
            'user' => $user, 
            'userStats' => $this->getUserStats($user),
            'addresses' => $this->getUserAddresses($user)
    ]);
    }

    /**
     * Get addresses for a user (customer).
     */
    protected function getUserAddresses(User $user)
    {
        return DB::table('customer_addresses')
            ->join('addresses', 'customer_addresses.address_id', '=', 'addresses.id')
            ->join('countries', 'addresses.country_id', '=', 'countries.id')
            ->select(
                'addresses.*',
                'countries.country_name',
            )
            ->where('customer_addresses.customer_id', $user->id)
            ->get();
    }

    /**
     * Get statistics for a user (customer).
     */
    protected function getUserStats(User $user)
    {
        if ($user->role !== 'customer') {
            return [];
        }

        $id = $user->id;

        // Get delivered status ID
        $deliveredStatus = \App\Models\OrderStatus::where('name', 'Delivered')->first();
        $deliveredStatusId = $deliveredStatus ? $deliveredStatus->id : 6; // Fallback to 6 based on seeder

        $stats = [
            'total_orders' => DB::table('food_orders')->where('customer_id', $id)->count(),
            'completed_orders' => DB::table('food_orders')
                ->where('customer_id', $id)
                ->where('order_status_id', $deliveredStatusId)
                ->count(),
            'total_spent' => DB::table('food_orders')
                ->where('customer_id', $id)
                ->where('order_status_id', $deliveredStatusId)
                ->sum('total_amount'),
            'average_order_value' => DB::table('food_orders')
                ->where('customer_id', $id)
                ->where('order_status_id', $deliveredStatusId)
                ->avg('total_amount'),
            'favorite_restaurants' => DB::table('food_orders')
                ->join('restaurants', 'food_orders.restaurant_id', '=', 'restaurants.id')
                ->select('restaurants.restaurant_name', DB::raw('COUNT(*) as order_count'))
                ->where('food_orders.customer_id', $id)
                ->groupBy('restaurants.id', 'restaurants.restaurant_name')
                ->orderBy('order_count', 'desc')
                ->limit(5)
                ->get(),
        ];

        // Recent orders
        $recentOrders = DB::table('food_orders')
            ->join('restaurants', 'food_orders.restaurant_id', '=', 'restaurants.id')
            ->join('order_statuses', 'food_orders.order_status_id', '=', 'order_statuses.id')
            ->select(
                'food_orders.id',
                'food_orders.total_amount',
                'food_orders.created_at',
                'restaurants.restaurant_name',
                'order_statuses.name as status'
            )
            ->where('food_orders.customer_id', $id)
            ->orderBy('food_orders.created_at', 'desc')
            ->limit(10)
            ->get();

        $stats['recent_orders'] = $recentOrders;

        return $stats;
    }

    public function edit(User $user)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        return Inertia::render('admin/Users/edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        $user = User::findOrFail($id);

        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id)
            ],
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:customer,admin',
            'is_available' => 'boolean',
            'password' => 'nullable|min:8|confirmed',
        ]);

        // Remove password if not provided
        if (empty($validatedData['password'])) {
            unset($validatedData['password']);
        } else {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        $user->update($validatedData);

        return redirect()->route('admin.users.show', $user->id)
            ->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        \Log::info('Delete request received for user: '.$user->id);
        
        // Authorization
        if (!auth()->user()->isAdmin()) {
            \Log::warning('Unauthorized delete attempt');
            return response()->json(['error' => 'Unauthorized action.'], 403);
        }

        // Prevent self-deletion
        if ($user->id === auth()->id()) {
            \Log::warning('Self-deletion attempt');
            return response()->json(['error' => 'You cannot delete your own account.'], 400);
        }

        // Check for existing orders
        if ($user->orders()->exists()) {
            \Log::warning('Attempt to delete user with orders');
            return response()->json(['error' => 'Cannot delete user with existing orders.'], 400);
        }

        try {
            \Log::info('Attempting to delete user');
            DB::transaction(function () use ($user) {
                $user->addresses()->delete();
                $user->delete();
            });
            
            \Log::info('User deleted successfully');
            return redirect()->route('admin.users.show')->with('success', 'User deleted successfully');
            
        } catch (\Exception $e) {
            \Log::error('Delete failed: '.$e->getMessage());
            return response()->json(['error' => 'Failed to delete user: '.$e->getMessage()], 500);
        }
    }

    public function toggleStatus($id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);

        // Prevent admin from deactivating themselves
        if ($user->id === auth()->id()) {
            return response()->json(['error' => 'You cannot deactivate your own account.'], 422);
        }

        $user->update(['is_available' => !$user->is_available]);

        return response()->json([
            'success' => true,
            'is_available' => $user->is_available,
            'message' => 'User status updated successfully'
        ]);
    }

    public function bulkAction(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'action' => 'required|in:activate,deactivate,delete,verify_email',
        ]);

        $userIds = $validatedData['user_ids'];
        $action = $validatedData['action'];

        // Prevent admin from performing actions on themselves
        if (in_array(auth()->id(), $userIds)) {
            return response()->json(['error' => 'You cannot perform bulk actions on your own account.'], 422);
        }

        try {
            switch ($action) {
                case 'activate':
                    User::whereIn('id', $userIds)->update(['is_available' => true]);
                    $message = 'Users activated successfully';
                    break;

                case 'deactivate':
                    User::whereIn('id', $userIds)->update(['is_available' => false]);
                    $message = 'Users deactivated successfully';
                    break;

                case 'verify_email':
                    User::whereIn('id', $userIds)
                        ->whereNull('email_verified_at')
                        ->update(['email_verified_at' => now()]);
                    $message = 'Email addresses verified successfully';
                    break;

                case 'delete':
                    // Check if any user has orders
                    $hasOrders = DB::table('food_orders')
                        ->whereIn('customer_id', $userIds)
                        ->exists();

                    if ($hasOrders) {
                        return response()->json([
                            'error' => 'Cannot delete users with existing orders. Deactivate them instead.'
                        ], 422);
                    }

                    // Delete user addresses first
                    DB::table('customer_addresses')->whereIn('customer_id', $userIds)->delete();
                    
                    User::whereIn('id', $userIds)->delete();
                    $message = 'Users deleted successfully';
                    break;
            }

            return response()->json(['success' => true, 'message' => $message]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to perform bulk action. Please try again.'], 500);
        }
    }

    public function export(Request $request)
    {
        $type = $request->get('type', 'list');

        if ($type === 'statistics') {
            return $this->exportStatistics($request);
        }

        return $this->exportList($request);
    }

    protected function exportStatistics(Request $request)
    {
        $stats = $this->getStatisticsData();
        $filename = 'user_statistics_export_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = ['Content-Type' => 'text/csv', 'Content-Disposition' => 'attachment; filename="' . $filename . '"'];

        $callback = function () use ($stats) {
            $file = fopen('php://output', 'w');

            // Summary Stats
            fputcsv($file, ['Metric', 'Value']);
            fputcsv($file, ['Total Users', $stats['total_users']]);
            fputcsv($file, ['Total Customers', $stats['total_customers']]);
            fputcsv($file, ['Total Admins', $stats['total_admins']]);
            fputcsv($file, ['Total Drivers', $stats['total_drivers']]);
            fputcsv($file, ['Verified Users', $stats['verified_users']]);
            fputcsv($file, []);

            // Registrations this month
            fputcsv($file, ['Registrations this Month']);
            fputcsv($file, ['Date', 'User Count']);
            foreach ($stats['registrations_by_day'] as $reg) {
                fputcsv($file, [$reg->date, $reg->count]);
            }
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Gather statistics data for export.
     */
    protected function getStatisticsData()
    {
        $total_users = User::count();
        $total_customers = User::where('role', 'customer')->count();
        $total_admins = User::where('role', 'admin')->count();
        $total_drivers = User::where('role', 'driver')->count();
        $verified_users = User::whereNotNull('email_verified_at')->count();

        // Registrations by day for current month
        $registrations_by_day = User::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as count')
            )
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return [
            'total_users' => $total_users,
            'total_customers' => $total_customers,
            'total_admins' => $total_admins,
            'total_drivers' => $total_drivers,
            'verified_users' => $verified_users,
            'registrations_by_day' => $registrations_by_day,
        ];
    }

    protected function exportList(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $query = User::query();

        // Apply filters
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                    ->orWhere('last_name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }
        if ($request->filled('is_available')) {
            $query->where('is_available', $request->boolean('is_available'));
        }
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $users = $query->select([
            'id', 'first_name', 'last_name', 'email', 'phone', 
            'role', 'is_available', 'email_verified_at', 'created_at'
        ])->get();

        $csvData = [];
        $csvData[] = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Status', 'Email Verified', 'Created At'];

        foreach ($users as $user) {
            $csvData[] = [
                $user->id,
                $user->first_name,
                $user->last_name,
                $user->email,
                $user->phone,
                $user->role,
                $user->is_available ? 'Available' : 'Unavailable',
                $user->email_verified_at ? 'Yes' : 'No',
                $user->created_at->format('Y-m-d H:i:s'),
            ];
        }

        $filename = 'users_export_' . now()->format('Y_m_d_H_i_s') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function() use ($csvData) {
            $file = fopen('php://output', 'w');
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function create()
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        return Inertia::render('admin/Users/create');
    }

    public function store(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:customer,admin',
            'is_available' => 'boolean',
            'password' => 'required|min:8|confirmed',
        ]);

        $validatedData['password'] = Hash::make($validatedData['password']);

        User::create($validatedData);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully');
    }

    /**
     * Display user statistics
     */
    public function statistics()
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        // Get total users by role
        $totalUsers = User::count();
        $totalCustomers = User::where('role', 'customer')->count();
        $totalDrivers = User::where('role', 'driver')->count();
        $totalAdmins = User::where('role', 'admin')->count();
        $activeUsers = User::where('is_available', true)->count();
        $inactiveUsers = User::where('is_available', false)->count();

        // Get users by month (registration date)
        $usersByMonth = User::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('count(*) as count')
            )
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        // Get top customers by orders
        $topCustomersByOrders = User::select(
                'users.first_name',
                'users.last_name',
                'users.email',
                DB::raw('count(food_orders.id) as order_count'),
                DB::raw('sum(food_orders.total_amount) as total_spent')
            )
            ->leftJoin('food_orders', 'users.id', '=', 'food_orders.customer_id')
            ->where('users.role', 'customer')
            ->groupBy('users.id', 'users.first_name', 'users.last_name', 'users.email')
            ->orderBy('order_count', 'desc')
            ->limit(10)
            ->get();

        // Get top customers by spending
        $topCustomersBySpending = User::select(
                'users.first_name',
                'users.last_name',
                'users.email',
                DB::raw('sum(food_orders.total_amount) as total_spent'),
                DB::raw('count(food_orders.id) as order_count')
            )
            ->leftJoin('food_orders', 'users.id', '=', 'food_orders.customer_id')
            ->where('users.role', 'customer')
            ->groupBy('users.id', 'users.first_name', 'users.last_name', 'users.email')
            ->orderBy('total_spent', 'desc')
            ->limit(10)
            ->get();

        // Get users by verification status
        $verifiedUsers = User::whereNotNull('email_verified_at')->count();
        $unverifiedUsers = User::whereNull('email_verified_at')->count();

        // Get recent users
        $recentUsers = User::select('id', 'first_name', 'last_name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Get average orders per customer
        $averageOrdersPerCustomer = $totalCustomers > 0 ? 
            DB::table('food_orders')->count() / $totalCustomers : 0;

        // Get average spending per customer
        $averageSpendingPerCustomer = $totalCustomers > 0 ? 
            DB::table('food_orders')->sum('total_amount') / $totalCustomers : 0;

        return Inertia::render('admin/Users/statistics', [
            'statistics' => [
                'total_users' => $totalUsers,
                'total_customers' => $totalCustomers,
                'total_drivers' => $totalDrivers,
                'total_admins' => $totalAdmins,
                'active_users' => $activeUsers,
                'inactive_users' => $inactiveUsers,
                'users_by_month' => $usersByMonth,
                'top_customers_by_orders' => $topCustomersByOrders,
                'top_customers_by_spending' => $topCustomersBySpending,
                'verified_users' => $verifiedUsers,
                'unverified_users' => $unverifiedUsers,
                'recent_users' => $recentUsers,
                'average_orders_per_customer' => round($averageOrdersPerCustomer, 2),
                'average_spending_per_customer' => round($averageSpendingPerCustomer, 2),
            ],
        ]);
    }
}