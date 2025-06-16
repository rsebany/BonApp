<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Models\Address;
use App\Models\Country;
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
            return redirect('/dashboard');
        }

        $query = Restaurant::with([
            'address:id,address_line1,city,region',
            'address.country:id,country_name'
        ]);

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('restaurant_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('city')) {
            $query->whereHas('address', function ($q) use ($request) {
                $q->where('city', 'like', "%{$request->city}%");
            });
        }

        // Apply sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        $allowedSorts = ['restaurant_name', 'created_at', 'email', 'phone'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $restaurants = $query->paginate(15)->withQueryString();

        // Get filter options
        $cities = DB::table('addresses')
            ->join('restaurants', 'addresses.id', '=', 'restaurants.address_id')
            ->distinct()
            ->pluck('city')
            ->filter()
            ->sort()
            ->values();

        return Inertia::render('admin/Restaurants/index', [
            'restaurants' => RestaurantResource::collection($restaurants),
            'cities' => $cities,
            'filters' => $request->only(['search', 'is_active', 'city', 'sort', 'direction']),
        ]);
    }

    public function create()
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $countries = Country::select('id', 'country_name')->orderBy('country_name')->get();

        return Inertia::render('admin/Restaurants/create', [
            'countries' => $countries,
        ]);
    }

    public function store(StoreRestaurantRequest $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        try {
            DB::beginTransaction();

            // Create address first
            $address = Address::create([
                'unit_number' => $request->address['unit_number'] ?? null,
                'street_number' => $request->address['street_number'] ?? null,
                'address_line1' => $request->address['address_line1'],
                'address_line2' => $request->address['address_line2'] ?? null,
                'city' => $request->address['city'],
                'region' => $request->address['region'],
                'postal_code' => $request->address['postal_code'],
                'country_id' => $request->address['country_id'],
            ]);

            // Handle image upload
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('restaurants', 'public');
            }

            // Create restaurant
            $restaurant = Restaurant::create([
                'restaurant_name' => $request->restaurant_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'description' => $request->description,
                'cuisine_type' => $request->cuisine_type,
                'opening_hours' => $request->opening_hours,
                'delivery_time' => $request->delivery_time,
                'minimum_order' => $request->minimum_order,
                'delivery_fee' => $request->delivery_fee,
                'image_path' => $imagePath,
                'is_active' => $request->boolean('is_active', true),
                'address_id' => $address->id,
            ]);

            DB::commit();

            return redirect()->route('admin.restaurants.index')
                ->with('success', 'Restaurant created successfully');

        } catch (\Exception $e) {
            DB::rollback();
            
            // Delete uploaded image if restaurant creation failed
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            return back()->withErrors(['error' => 'Failed to create restaurant. Please try again.']);
        }
    }

    public function show($id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $restaurant = Restaurant::with([
            'address',
            'address.country:id,country_name',
            'menuItems' => function ($query) {
                $query->select('id', 'restaurant_id', 'item_name', 'price', 'is_available')
                    ->orderBy('item_name');
            }
        ])->findOrFail($id);

        // Get restaurant statistics
        $stats = [
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
                'order_statuses.name as status_value'
            )
            ->where('food_orders.restaurant_id', $id)
            ->orderBy('food_orders.created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('admin/Restaurants/show', [  // Note: Capitalized 'Admin' and 'Show'
            'restaurant' => new RestaurantResource($restaurant),
            'stats' => $stats,
            'recentOrders' => $recentOrders,
        ]);
    }

    public function edit(Restaurant $restaurant)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $restaurant = Restaurant::with(['address', 'address.country'])->findOrFail($restaurant->id);
        $countries = Country::select('id', 'country_name')->orderBy('country_name')->get();

        return Inertia::render('admin/Restaurants/edit', [
            'restaurant' => $restaurant->id ? new RestaurantResource($restaurant) : null,
            'countries' => $countries,
        ]);
    }

    public function update(UpdateRestaurantRequest $request, Restaurant $restaurant)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
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

            // Handle image upload
            $updateData = [
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
            ];

            if ($request->hasFile('image')) {
                // Delete old image
                if ($restaurant->image_path && Storage::disk('public')->exists($restaurant->image_path)) {
                    Storage::disk('public')->delete($restaurant->image_path);
                }

                $updateData['image_path'] = $request->file('image')->store('restaurants', 'public');
            }

            // Update restaurant
            $restaurant->update($updateData);

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
            return redirect('/dashboard');
        }

        $restaurant = Restaurant::findOrFail($id);

        // Check if restaurant has orders
        $hasOrders = DB::table('food_orders')->where('restaurant_id', $id)->exists();

        if ($hasOrders) {
            return back()->withErrors(['error' => 'Cannot delete restaurant with existing orders. Deactivate it instead.']);
        }

        try {
            DB::beginTransaction();

            // Delete image
            if ($restaurant->image_path && Storage::disk('public')->exists($restaurant->image_path)) {
                Storage::disk('public')->delete($restaurant->image_path);
            }

            // Delete menu items first
            $restaurant->menuItems()->delete();

            // Delete restaurant (address will be deleted via cascade)
            $restaurant->delete();

            DB::commit();

            return redirect()->route('admin.restaurants.index')
                ->with('success', 'Restaurant deleted successfully');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to delete restaurant. Please try again.']);
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
                    $message = 'Restaurants deactivated successfully';
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

                    $restaurants = Restaurant::whereIn('id', $restaurantIds)->get();
                    
                    // Delete images and menu items
                    foreach ($restaurants as $restaurant) {
                        if ($restaurant->image_path && Storage::disk('public')->exists($restaurant->image_path)) {
                            Storage::disk('public')->delete($restaurant->image_path);
                        }
                        $restaurant->menuItems()->delete();
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

            $restaurants = Restaurant::whereIn('id', $restaurantIds)->get();
            
            // Delete images and menu items
            foreach ($restaurants as $restaurant) {
                if ($restaurant->image_path && Storage::disk('public')->exists($restaurant->image_path)) {
                    Storage::disk('public')->delete($restaurant->image_path);
                }
                $restaurant->menuItems()->delete();
            }

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
}