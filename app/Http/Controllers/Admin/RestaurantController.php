<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Models\Address;
use App\Models\Country;
use App\Models\FoodOrder;
use App\Http\Requests\StoreRestaurantRequest;
use App\Http\Requests\UpdateRestaurantRequest;
use App\Http\Resources\RestaurantResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class RestaurantController extends Controller
{
    public function index(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        $query = Restaurant::with([
            'address:id,address_line1,city,region',
            'address.country:id,country_name'
        ]);

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('restaurant_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('city')) {
            $query->whereHas('address', function ($q) use ($request) {
                $q->where('city', 'like', "%{$request->city}%");
            });
        }

        // Add date range filter (optional, for consistency)
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Apply sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        $allowedSorts = ['restaurant_name', 'created_at', 'email', 'phone'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        }

        // Handle pagination with dynamic page size
        $perPage = $request->get('per_page', 15);
        $allowedPerPage = [10, 25, 50, 100];
        if (!in_array($perPage, $allowedPerPage)) {
            $perPage = 15; // Default fallback
        }

        $restaurants = $query->paginate($perPage)->withQueryString();

        // Get filter options
        $cities = DB::table('addresses')
            ->join('restaurants', 'addresses.id', '=', 'restaurants.address_id')
            ->distinct()
            ->pluck('city')
            ->filter()
            ->sort()
            ->values();

        // Add stats array (UserController pattern)
        $stats = [
            'total_restaurants' => Restaurant::count(),
            'active_restaurants' => Restaurant::where('is_active', true)->count(),
            'new_this_month' => Restaurant::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'with_orders' => DB::table('food_orders')->distinct('restaurant_id')->count('restaurant_id'),
        ];

        return Inertia::render('admin/Restaurants/index', [
            'restaurants' => RestaurantResource::collection($restaurants),
            'cities' => $cities,
            'filters' => $request->only(['search', 'is_active', 'city', 'sort', 'direction', 'date_from', 'date_to', 'per_page']),
            'user' => [
                'role' => auth()->user()->role,
            ],
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        $countries = Country::select('id', 'country_name')->orderBy('country_name')->get();

        return Inertia::render('admin/Restaurants/create', [
            'countries' => $countries,
        ]);
    }

    public function store(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        $validated = $request->validate([
            'restaurant_name' => 'required|string|max:255',
            'email' => 'required|email|unique:restaurants,email',
            'phone' => 'required|string|max:20',
            'description' => 'nullable|string',
            'cuisine_type' => 'required|string|max:255',
            'opening_hours' => 'required|string',
            'delivery_time' => 'required|integer|min:1',
            'minimum_order' => 'required|numeric|min:0',
            'delivery_fee' => 'required|numeric|min:0',
            // Address validation
            'address.unit_number' => 'nullable|string|max:10',
            'address.street_number' => 'nullable|string|max:20',
            'address.address_line1' => 'required|string|max:255',
            'address.address_line2' => 'nullable|string|max:255',
            'address.city' => 'required|string|max:100',
            'address.region' => 'required|string|max:100',
            'address.postal_code' => 'required|string|max:20',
            'address.country_id' => 'required|exists:countries,id',
        ]);

        try {
            DB::beginTransaction();

            // Create address first
            $address = Address::create([
                'user_id' => auth()->id(),
                'unit_number' => $validated['address']['unit_number'] ?? null,
                'street_number' => $validated['address']['street_number'] ?? null,
                'address_line1' => $validated['address']['address_line1'],
                'address_line2' => $validated['address']['address_line2'] ?? null,
                'city' => $validated['address']['city'],
                'region' => $validated['address']['region'],
                'postal_code' => $validated['address']['postal_code'],
                'country_id' => $validated['address']['country_id'],
            ]);

            // Verify address was created
            if (!$address || !$address->id) {
                throw new \Exception('Failed to create address');
            }

            // Create restaurant
            $restaurant = Restaurant::create([
                'restaurant_name' => $validated['restaurant_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'description' => $validated['description'] ?? null,
                'cuisine_type' => $validated['cuisine_type'],
                'opening_hours' => $validated['opening_hours'],
                'delivery_time' => $validated['delivery_time'],
                'minimum_order' => $validated['minimum_order'],
                'delivery_fee' => $validated['delivery_fee'],
                'is_active' => true,
                'address_id' => $address->id,
            ]);

            // Verify restaurant was created
            if (!$restaurant || !$restaurant->id) {
                throw new \Exception('Failed to create restaurant');
            }

            DB::commit();

            // Clear any cache if you're using it
            // Cache::flush(); // Uncomment if using cache

            return redirect()->route('admin.restaurants.index')
                ->with('success', 'Restaurant created successfully!');

        } catch (\Exception $e) {
            DB::rollback();
            
            // Log the error for debugging
            \Log::error('Restaurant creation failed: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'data' => $validated,
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withInput()
                ->with('error', 'Failed to create restaurant: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        $restaurant = Restaurant::with([
            'address',
            'address.country:id,country_name',
            'menuItems' => function ($query) {
                $query->select('id', 'restaurant_id', 'item_name', 'price', 'is_available')
                    ->orderBy('item_name');
            }
        ])->findOrFail($id);

        // Use helper for stats
        $stats = $this->getRestaurantStats($restaurant);

        // Recent orders
        $recentOrders = DB::table('food_orders')
            ->join('users', 'food_orders.customer_id', '=', 'users.id')
            ->join('order_statuses', 'food_orders.order_status_id', '=', 'order_statuses.id')
            ->select(
                'food_orders.id',
                'food_orders.total_amount',
                'food_orders.created_at',
                'food_orders.cust_restaurant_rating',
                'users.first_name',
                'users.last_name',
                'order_statuses.name as status'
            )
            ->where('food_orders.restaurant_id', $id)
            ->orderBy('food_orders.created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('admin/Restaurants/show', [
            'restaurant' => (new RestaurantResource($restaurant))->resolve(),
            'stats' => $stats,
            'recentOrders' => $recentOrders,
        ]);
    }

    public function edit(Restaurant $restaurant)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        $restaurant = Restaurant::with(['address', 'address.country'])->findOrFail($restaurant->id);
        $countries = Country::select('id', 'country_name')->orderBy('country_name')->get();

        return Inertia::render('admin/Restaurants/edit', [
            'restaurant' => $restaurant->id ? (new RestaurantResource($restaurant))->resolve() : null,
            'countries' => $countries,
        ]);
    }

    public function update(UpdateRestaurantRequest $request, Restaurant $restaurant)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        try {
            DB::beginTransaction();

            // Update address
            $restaurant->address->update([
                'unit_number' => $request->address['unit_number'] ?? null,
                'street_number' => $request->address['street_number'] ?? null,
                'address_line1' => $request->address['address_line1'],
                'address_line2' => $request->address['address_line2'] ?? null,
                'city' => $request->address['city'],
                'region' => $request->address['region'],
                'postal_code' => $request->address['postal_code'],
                'country_id' => $request->address['country_id'],
            ]);

            // Update restaurant
            $restaurant->update([
                'restaurant_name' => $request->restaurant_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'description' => $request->description,
                'cuisine_type' => $request->cuisine_type,
                'opening_hours' => $request->opening_hours,
                'delivery_time' => $request->delivery_time,
                'minimum_order' => $request->minimum_order,
                'delivery_fee' => $request->delivery_fee,
                'is_active' => $request->boolean('is_active'),
            ]);

            DB::commit();

            return redirect()->route('admin.restaurants.show', $restaurant)
                ->with('success', 'Restaurant updated successfully');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to update restaurant. Please try again.']);
        }
    }

    public function destroy($id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home')->withErrors(['error' => 'You are not authorized to delete restaurants.']);
        }

        $restaurant = Restaurant::findOrFail($id);
        $address = $restaurant->address;

        try {
            DB::beginTransaction();

            // Get IDs of menu items to avoid loading models
            $menuItemIds = $restaurant->menuItems()->pluck('id');

            // Delete order items linked to this restaurant's menu items
            if ($menuItemIds->isNotEmpty()) {
                DB::table('order_menu_items')->whereIn('menu_item_id', $menuItemIds)->delete();
            }

            // Now, delete the orders linked to the restaurant
            $restaurant->orders()->delete();

            // Then, delete the menu items
            $restaurant->menuItems()->delete();

            // Clean up customer_addresses linking to the restaurant's address
            if ($address) {
                DB::table('customer_addresses')->where('address_id', $address->id)->delete();
            }

            // Force delete the restaurant itself.
            $restaurant->forceDelete();

            // Now, delete the address
            if ($address) {
                $address->delete();
            }

            DB::commit();

            return redirect()->route('admin.restaurants.index')
                ->with('success', 'Restaurant deleted permanently.');

        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Restaurant deletion failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to delete restaurant. It might be referenced by other records.']);
        }
    }

    public function toggleStatus($id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $restaurant = Restaurant::findOrFail($id);
        $restaurant->update(['is_active' => !$restaurant->is_active]);

        return response()->json([
            'success' => true,
            'is_active' => $restaurant->is_active,
            'message' => 'Restaurant status updated successfully'
        ]);
    }

    public function bulkAction(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'restaurant_ids' => 'required|array',
            'restaurant_ids.*' => 'exists:restaurants,id',
            'action' => 'required|in:activate,deactivate,delete',
        ]);

        $restaurantIds = $validatedData['restaurant_ids'];
        $action = $validatedData['action'];

        try {
            switch ($action) {
                case 'activate':
                    Restaurant::whereIn('id', $restaurantIds)->update(['is_active' => true]);
                    $message = 'Restaurants activated successfully';
                    break;

                case 'deactivate':
                    Restaurant::whereIn('id', $restaurantIds)->update(['is_active' => false]);
                    break;

                case 'delete':
                    // Check if any restaurant has orders
                    $hasOrders = DB::table('food_orders')
                        ->whereIn('restaurant_id', $restaurantIds)
                        ->exists();

                    if ($hasOrders) {
                        return response()->json([
                            'error' => 'Cannot delete restaurants with existing orders. Deactivate them instead.'
                        ], 422);
                    }

                    Restaurant::whereIn('id', $restaurantIds)->delete();
                    $message = 'Restaurants deleted successfully';
                    break;
            }

            return response()->json(['success' => true, 'message' => $message]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to perform bulk action. Please try again.'], 500);
        }
    }

    public function bulkDelete(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'restaurant_ids' => 'required|array',
            'restaurant_ids.*' => 'exists:restaurants,id',
        ]);

        $restaurantIds = $validatedData['restaurant_ids'];

        try {
            // Check if any restaurant has orders
            $hasOrders = DB::table('food_orders')
                ->whereIn('restaurant_id', $restaurantIds)
                ->exists();

            if ($hasOrders) {
                return back()->withErrors(['error' => 'Cannot delete restaurants with existing orders. Deactivate them instead.']);
            }

            DB::beginTransaction();

            Restaurant::whereIn('id', $restaurantIds)->delete();

            DB::commit();

            return redirect()->route('admin.restaurants.index')
                ->with('success', 'Selected restaurants deleted successfully');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to delete restaurants. Please try again.']);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $restaurant = Restaurant::findOrFail($id);
        
        $validatedData = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $restaurant->update(['is_active' => $validatedData['is_active']]);

        return redirect()->back()
            ->with('success', 'Restaurant status updated successfully');
    }

    /**
     * Get statistics for a restaurant.
     */
    protected function getRestaurantStats(Restaurant $restaurant)
    {
        $id = $restaurant->id;
        return [
            'total_orders' => DB::table('food_orders')
                ->where('restaurant_id', $id)
                ->count(),
            'completed_orders' => DB::table('food_orders')
                ->where('restaurant_id', $id)
                ->where('order_status_id', 4)
                ->count(),
            'total_revenue' => DB::table('food_orders')
                ->where('restaurant_id', $id)
                ->where('order_status_id', 4)
                ->sum('total_amount'),
            'average_rating' => DB::table('food_orders')
                ->where('restaurant_id', $id)
                ->whereNotNull('cust_restaurant_rating')
                ->avg('cust_restaurant_rating'),
            'menu_items_count' => $restaurant->menuItems->count(),
        ];
    }

    /**
     * Display restaurant statistics
     */
    public function statistics()
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('user.home');
        }

        // Get total restaurants and active restaurants
        $totalRestaurants = Restaurant::count();
        $activeRestaurants = Restaurant::where('is_active', true)->count();
        $inactiveRestaurants = Restaurant::where('is_active', false)->count();

        // Get restaurants by city
        $restaurantsByCity = Restaurant::select(
                'addresses.city',
                DB::raw('count(*) as count')
            )
            ->join('addresses', 'restaurants.address_id', '=', 'addresses.id')
            ->groupBy('addresses.city')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        // Get restaurants by country
        $restaurantsByCountry = Restaurant::select(
                'countries.country_name',
                DB::raw('count(*) as count')
            )
            ->join('addresses', 'restaurants.address_id', '=', 'addresses.id')
            ->join('countries', 'addresses.country_id', '=', 'countries.id')
            ->groupBy('countries.country_name')
            ->orderBy('count', 'desc')
            ->get();

        // Get top performing restaurants by orders
        $topRestaurantsByOrders = Restaurant::select(
                'restaurants.restaurant_name',
                DB::raw('count(food_orders.id) as order_count'),
                DB::raw('sum(food_orders.total_amount) as total_revenue')
            )
            ->leftJoin('food_orders', 'restaurants.id', '=', 'food_orders.restaurant_id')
            ->groupBy('restaurants.id', 'restaurants.restaurant_name')
            ->orderBy('order_count', 'desc')
            ->limit(10)
            ->get();

        // Get restaurants by month (creation date)
        $restaurantsByMonth = Restaurant::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('count(*) as count')
            )
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        // Get recent restaurants
        $recentRestaurants = Restaurant::with(['address:id,city,country_id', 'address.country:id,country_name'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Get average menu items per restaurant
        $averageMenuItems = Restaurant::withCount('menuItems')->get()->avg('menu_items_count');

        return Inertia::render('admin/Restaurants/statistics', [
            'statistics' => [
                'total_restaurants' => $totalRestaurants,
                'active_restaurants' => $activeRestaurants,
                'inactive_restaurants' => $inactiveRestaurants,
                'restaurants_by_city' => $restaurantsByCity,
                'restaurants_by_country' => $restaurantsByCountry,
                'top_restaurants_by_orders' => $topRestaurantsByOrders,
                'restaurants_by_month' => $restaurantsByMonth,
                'recent_restaurants' => $recentRestaurants,
                'average_menu_items' => round($averageMenuItems, 2),
            ],
        ]);
    }

    public function export(Request $request)
    {
        $type = $request->get('type', 'list'); // Default to 'list'

        if ($type === 'statistics') {
            return $this->exportStatistics($request);
        }

        return $this->exportList($request);
    }

    protected function exportStatistics(Request $request)
    {
        $stats = $this->getStatisticsData();
        $filename = 'restaurant_statistics_export_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = ['Content-Type' => 'text/csv', 'Content-Disposition' => 'attachment; filename="' . $filename . '"'];

        $callback = function () use ($stats) {
            $file = fopen('php://output', 'w');

            // Summary Stats
            fputcsv($file, ['Metric', 'Value']);
            fputcsv($file, ['Total Restaurants', $stats['total_restaurants']]);
            fputcsv($file, ['Active Restaurants', $stats['active_restaurants']]);
            fputcsv($file, ['Inactive Restaurants', $stats['inactive_restaurants']]);
            fputcsv($file, ['Average Orders per Restaurant', number_format((float) $stats['avg_orders_per_restaurant'], 2)]);
            fputcsv($file, ['Average Revenue per Restaurant', '$' . number_format((float) $stats['avg_revenue_per_restaurant'], 2)]);
            fputcsv($file, []);

            // Top Restaurants by Orders
            fputcsv($file, ['Top 10 Restaurants by Orders']);
            fputcsv($file, ['Restaurant', 'Total Orders']);
            foreach ($stats['top_restaurants_by_orders'] as $restaurant) {
                fputcsv($file, [$restaurant->restaurant_name, $restaurant->total_orders]);
            }
            fputcsv($file, []);
            
            // Top Restaurants by Revenue
            fputcsv($file, ['Top 10 Restaurants by Revenue']);
            fputcsv($file, ['Restaurant', 'Total Revenue']);
            foreach ($stats['top_restaurants_by_revenue'] as $restaurant) {
                fputcsv($file, [$restaurant->restaurant_name, '$' . number_format((float) $restaurant->total_revenue, 2)]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    protected function exportList(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $query = Restaurant::query();

        // Apply filters as in index
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }
        if ($request->filled('city')) {
            $query->whereHas('address', function ($q) use ($request) {
                $q->where('city', 'like', "%{$request->city}%");
            });
        }
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $restaurants = $query->with(['address', 'address.country'])->get();

        $csvData = [];
        $csvData[] = ['ID', 'Name', 'Email', 'Phone', 'Active', 'City', 'Country', 'Created At'];
        foreach ($restaurants as $restaurant) {
            $csvData[] = [
                $restaurant->id,
                $restaurant->restaurant_name,
                $restaurant->email,
                $restaurant->phone,
                $restaurant->is_active ? 'Yes' : 'No',
                $restaurant->address ? $restaurant->address->city : '',
                $restaurant->address && $restaurant->address->country ? $restaurant->address->country->country_name : '',
                $restaurant->created_at ? $restaurant->created_at->format('Y-m-d H:i:s') : '',
            ];
        }

        $filename = 'restaurants_export_' . now()->format('Y_m_d_H_i_s') . '.csv';
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

    /**
     * Gather statistics data for export.
     */
    protected function getStatisticsData()
    {
        $total_restaurants = Restaurant::count();
        $active_restaurants = Restaurant::where('is_active', true)->count();
        $inactive_restaurants = Restaurant::where('is_active', false)->count();

        // Get average orders per restaurant
        $avg_orders_per_restaurant = Restaurant::withCount('orders')->get()->avg('orders_count');

        // Get average revenue per restaurant
        $avg_revenue_per_restaurant = Restaurant::withSum('orders', 'total_amount')->get()->avg('orders_sum_total_amount');

        // Get top restaurants by orders
        $top_restaurants_by_orders = Restaurant::select(
                'restaurants.restaurant_name',
                DB::raw('count(food_orders.id) as total_orders')
            )
            ->leftJoin('food_orders', 'restaurants.id', '=', 'food_orders.restaurant_id')
            ->groupBy('restaurants.id', 'restaurants.restaurant_name')
            ->orderBy('total_orders', 'desc')
            ->limit(10)
            ->get();

        // Get top restaurants by revenue
        $top_restaurants_by_revenue = Restaurant::select(
                'restaurants.restaurant_name',
                DB::raw('sum(food_orders.total_amount) as total_revenue')
            )
            ->leftJoin('food_orders', 'restaurants.id', '=', 'food_orders.restaurant_id')
            ->groupBy('restaurants.id', 'restaurants.restaurant_name')
            ->orderBy('total_revenue', 'desc')
            ->limit(10)
            ->get();

        return [
            'total_restaurants' => $total_restaurants,
            'active_restaurants' => $active_restaurants,
            'inactive_restaurants' => $inactive_restaurants,
            'avg_orders_per_restaurant' => $avg_orders_per_restaurant ?? 0,
            'avg_revenue_per_restaurant' => $avg_revenue_per_restaurant ?? 0,
            'top_restaurants_by_orders' => $top_restaurants_by_orders,
            'top_restaurants_by_revenue' => $top_restaurants_by_revenue,
        ];
    }
}