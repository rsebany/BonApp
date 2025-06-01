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

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $query = User::query();

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('email_verified')) {
            if ($request->boolean('email_verified')) {
                $query->whereNotNull('email_verified_at');
            } else {
                $query->whereNull('email_verified_at');
            }
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
        
        $allowedSorts = ['first_name', 'last_name', 'email', 'created_at', 'role'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $users = $query->paginate(15)->withQueryString();

        // Get statistics
        $stats = [
            'total_users' => User::count(),
            'customers' => User::where('role', 'customer')->count(),
            'admins' => User::where('role', 'admin')->count(),
            'active_users' => User::where('is_active', true)->count(),
            'verified_users' => User::whereNotNull('email_verified_at')->count(),
            'new_this_month' => User::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => UserResource::collection($users),
            'stats' => $stats,
            'filters' => $request->only([
                'search', 'role', 'is_active', 'email_verified', 
                'date_from', 'date_to', 'sort', 'direction'
            ]),
        ]);
    }

    public function show($id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $user = User::findOrFail($id);

        // Get user statistics if customer
        $userStats = [];
        if ($user->role === 'customer') {
            $userStats = [
                'total_orders' => DB::table('food_orders')->where('customer_id', $id)->count(),
                'completed_orders' => DB::table('food_orders')
                    ->where('customer_id', $id)
                    ->where('order_status_id', 4)
                    ->count(),
                'total_spent' => DB::table('food_orders')
                    ->where('customer_id', $id)
                    ->where('order_status_id', 4)
                    ->sum('total_amount'),
                'average_order_value' => DB::table('food_orders')
                    ->where('customer_id', $id)
                    ->where('order_status_id', 4)
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
                    'order_statuses.status_value'
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
                'customer_addresses.is_default'
            )
            ->where('customer_addresses.customer_id', $id)
            ->get();

        return Inertia::render('Admin/Users/Show', [
            'user' => new UserResource($user),
            'userStats' => $userStats,
            'addresses' => $addresses,
        ]);
    }

    public function edit($id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $user = User::findOrFail($id);

        return Inertia::render('Admin/Users/Edit', [
            'user' => new UserResource($user),
        ]);
    }

    public function update(Request $request, $id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
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
            'is_active' => 'boolean',
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

    public function destroy($id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $user = User::findOrFail($id);

        // Prevent admin from deleting themselves
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete your own account.']);
        }

        // Check if user has orders
        $hasOrders = DB::table('food_orders')->where('customer_id', $id)->exists();

        if ($hasOrders) {
            return back()->withErrors(['error' => 'Cannot delete user with existing orders. Deactivate the account instead.']);
        }

        try {
            DB::beginTransaction();

            // Delete user addresses
            DB::table('customer_addresses')->where('customer_id', $id)->delete();
            
            // Delete user
            $user->delete();

            DB::commit();

            return redirect()->route('admin.users.index')
                ->with('success', 'User deleted successfully');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to delete user. Please try again.']);
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

        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'success' => true,
            'is_active' => $user->is_active,
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
                    User::whereIn('id', $userIds)->update(['is_active' => true]);
                    $message = 'Users activated successfully';
                    break;

                case 'deactivate':
                    User::whereIn('id', $userIds)->update(['is_active' => false]);
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
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $query = User::query();

        // Apply same filters as index
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $users = $query->select([
            'id', 'first_name', 'last_name', 'email', 'phone', 
            'role', 'is_active', 'email_verified_at', 'created_at'
        ])->get();

        $csvData = [];
        $csvData[] = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Active', 'Email Verified', 'Created At'];

        foreach ($users as $user) {
            $csvData[] = [
                $user->id,
                $user->first_name,
                $user->last_name,
                $user->email,
                $user->phone,
                $user->role,
                $user->is_active ? 'Yes' : 'No',
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
}