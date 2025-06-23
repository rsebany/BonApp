<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Driver;
use App\Models\FoodOrder;
use App\Models\MenuItem;
use App\Models\OrderStatus;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Log;
use App\Services\GeocodingService;

class OrderController extends Controller
{
    use AuthorizesRequests;

    protected $geocodingService;

    public function __construct(GeocodingService $geocodingService)
    {
        $this->geocodingService = $geocodingService;
    }

    public function index(Request $request)
    {
        $query = FoodOrder::with([
            'customer:id,first_name,last_name,email',
            'restaurant:id,restaurant_name',
            'orderStatus:id,name',
            'assignedDriver:id,first_name,last_name'
        ])
        ->latest();

        // Apply filters
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->whereHas('customer', function($q) use ($request) {
                    $q->where('first_name', 'like', "%{$request->search}%")
                    ->orWhere('last_name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
                })
                ->orWhereHas('restaurant', function($q) use ($request) {
                    $q->where('restaurant_name', 'like', "%{$request->search}%");
                });
            });
        }

        if ($request->filled('status')) {
            $query->whereHas('orderStatus', function($q) use ($request) {
                $q->where('name', $request->status);  // Changed from 'status' to 'name'
            });
        }

        if ($request->filled('restaurant')) {
            $query->where('restaurant_id', $request->restaurant);
        }

        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->whereBetween('order_date_time', [
                $request->date_from,
                $request->date_to
            ]);
        }

        // Apply sorting
        if ($request->filled('sort') && $request->filled('direction')) {
            $query->orderBy($request->sort, $request->direction);
        }

        // Handle pagination with dynamic page size
        $perPage = $request->get('per_page', 15);
        $allowedPerPage = [10, 25, 50, 100];
        if (!in_array($perPage, $allowedPerPage)) {
            $perPage = 15; // Default fallback
        }

        $orders = $query->paginate($perPage)
            ->withQueryString()
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'customer' => [
                        'id' => $order->customer->id,
                        'first_name' => $order->customer->first_name,
                        'last_name' => $order->customer->last_name,
                        'email' => $order->customer->email,
                    ],
                    'restaurant' => [
                        'id' => $order->restaurant->id,
                        'restaurant_name' => $order->restaurant->restaurant_name,
                    ],
                    'order_status' => [
                        'id' => $order->orderStatus->id,
                        'status' => $order->orderStatus->name,  // Changed from status to name
                    ],
                    'assigned_driver' => $order->assignedDriver ? [
                        'id' => $order->assignedDriver->id,
                        'first_name' => $order->assignedDriver->first_name,
                        'last_name' => $order->assignedDriver->last_name,
                    ] : null,
                    'total_amount' => number_format($order->total_amount, 2),
                    'delivery_fee' => number_format($order->delivery_fee, 2),
                    'created_at' => $order->created_at->toDateTimeString(),
                    'status' => $order->orderStatus->name,  // Changed from status to name
                ];
            });

        return Inertia::render('admin/Orders/index', [
            'orders' => $orders,
            'orderStatuses' => OrderStatus::select('id', 'name as status')->get(),  // Using alias here
            'restaurants' => Restaurant::select('id', 'restaurant_name')->get(),
            'filters' => $request->only(['search', 'status', 'restaurant', 'date_from', 'date_to', 'sort', 'direction', 'per_page']),
            'user' => [
                'role' => auth()->user()->role,
            ],
        ]);
    }

    public function show($id, Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $order = FoodOrder::with([
            'customer:id,first_name,last_name,email,phone',
            'restaurant:id,restaurant_name',
            'restaurant.address:id,address_line1,address_line2,city,region,postal_code,country_id',
            'restaurant.address.country:id,country_name',
            'orderStatus:id,name',
            'assignedDriver:id,first_name,last_name,phone',
            'customerAddress:id,address_line1,address_line2,city,region,postal_code,country_id',
            'customerAddress.country:id,country_name',
            'orderItems.menuItem:id,item_name,price'
        ])->findOrFail($id);

        // Get available drivers
        $availableDrivers = User::select('id', 'first_name', 'last_name', 'phone')
            ->where('role', 'driver')
            ->where(function($query) use ($order) {
                $query->where('is_available', true)
                    ->orWhere('id', $order->assigned_driver_id);
            })
            ->get();

        // Updated to only select existing columns
        $orderStatuses = OrderStatus::select('id', 'name')->get();

        return Inertia::render('admin/Orders/show', [
            'order' => $order,
            'availableDrivers' => $availableDrivers,
            'orderStatuses' => $orderStatuses,
            'filters' => $request->only(['status', 'restaurant', 'date_from', 'date_to', 'search']),
        ]);
    }

    public function create()
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $customers = User::with(['addresses'])
            ->where('role', 'customer')
            ->orderBy('first_name')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'first_name' => $customer->first_name,
                    'last_name' => $customer->last_name,
                    'email' => $customer->email,
                    'addresses' => $customer->addresses->map(function ($address) {
                        return [
                            'id' => $address->id,
                            'street_number' => $address->street_number,
                            'address_line1' => $address->address_line1,
                            'city' => $address->city,
                            'region' => $address->region,
                            'postal_code' => $address->postal_code,
                        ];
                    })
                ];
            });

        $restaurants = Restaurant::with(['address', 'menuItems'])
            ->orderBy('restaurant_name')
            ->get()
            ->map(function ($restaurant) {
                return [
                    'id' => $restaurant->id,
                    'restaurant_name' => $restaurant->restaurant_name,
                    'address' => $restaurant->address ? [
                        'street_number' => $restaurant->address->street_number,
                        'address_line1' => $restaurant->address->address_line1,
                        'city' => $restaurant->address->city,
                        'region' => $restaurant->address->region,
                        'postal_code' => $restaurant->address->postal_code,
                    ] : null,
                    'menu_items' => $restaurant->menuItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'item_name' => $item->item_name,
                            'price' => $item->price,
                        ];
                    })
                ];
            });

        $orderStatuses = OrderStatus::select('id', 'name as status')->get();

        $drivers = User::select('id', 'first_name', 'last_name')
            ->where('role', 'driver')
            ->where('is_available', true)
            ->get();

        return Inertia::render('admin/Orders/create', [
            'customers' => $customers,
            'restaurants' => $restaurants,
            'orderStatuses' => $orderStatuses,
            'drivers' => $drivers,
        ]);
    }

    public function store(Request $request)
    {
    $validated = $request->validate([
        'customer_id' => 'required|exists:users,id',
        'restaurant_id' => 'required|exists:restaurants,id',
        'order_status_id' => 'required|exists:order_statuses,id',
        'assigned_driver_id' => 'nullable|exists:users,id',
        'delivery_fee' => 'required|numeric|min:0',
        'total_amount' => 'required|numeric|min:0',
        'items' => 'required|array|min:1',
        'items.*.menu_item_id' => 'required|exists:menu_items,id',
        'items.*.quantity' => 'required|integer|min:1',
        'items.*.price' => 'required|numeric|min:0',
        'items.*.subtotal' => 'required|numeric|min:0',
        // Address fields (either customer_address_id or manual address)
        'customer_address_id' => 'required_without_all:address_line1,street_number,city,region,postal_code|exists:customer_addresses,id',
        'address_line1' => 'required_without:customer_address_id',
        'street_number' => 'required_without:customer_address_id',
        'city' => 'required_without:customer_address_id',
        'region' => 'required_without:customer_address_id',
        'postal_code' => 'required_without:customer_address_id',
    ]);

    try {
        DB::beginTransaction();
        
        $order = FoodOrder::create([
            'customer_id' => $validated['customer_id'],
            'restaurant_id' => $validated['restaurant_id'],
            'customer_address_id' => $validated['customer_address_id'],
            'order_status_id' => $validated['order_status_id'],
            'assigned_driver_id' => $validated['assigned_driver_id'],
            'delivery_fee' => $validated['delivery_fee'],
            'total_amount' => $validated['total_amount'],
            'order_date_time' => now(),
            'requested_delivery_date_time' => now()->addHour(),
        ]);

        foreach ($validated['items'] as $item) {
            $order->orderItems()->create([
                'menu_item_id' => $item['menu_item_id'],
                'qty_ordered' => $item['quantity'],
                'unit_price' => $item['price'],
            ]);
        }
        
        DB::commit();

        return redirect()->route('admin.orders.index')
            ->with('success', 'Order created successfully');
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Order creation failed: ' . $e->getMessage());
        return back()->withErrors(['message' => 'Error creating order: ' . $e->getMessage()]);
    }

    // If the request expects JSON, return a 200 OK JSON response
    if ($request->wantsJson()) {
        return response()->json(['message' => 'Order created successfully'], 200);
    }
}

    public function edit($id)
    {
        try {
            $order = FoodOrder::with([
                'customer:id,first_name,last_name,email',
                'restaurant:id,restaurant_name,address_id',
                'restaurant.address:id,street_number,address_line1,city,region,postal_code',
                'orderStatus:id,name',
                'assignedDriver:id,first_name,last_name,is_available',
                'customerAddress:id,address_line1,address_line2,city,region,postal_code',
                'orderItems.menuItem:id,item_name,price'
            ])->findOrFail($id);

            $this->authorize('update', $order);

            $mappedOrder = $order->toArray();
            $mappedOrder['items'] = $order->orderItems->map(function ($item) {
                return [
                    'menu_item_id' => $item->menu_item_id,
                    'quantity' => $item->qty_ordered,
                    'price' => $item->menuItem->price,
                    'subtotal' => $item->qty_ordered * $item->menuItem->price,
                ];
            });

            $customers = User::with(['addresses'])
                ->where('role', 'customer')
                ->orderBy('first_name')
                ->get()
                ->map(function ($customer) {
                    return [
                        'id' => $customer->id,
                        'first_name' => $customer->first_name,
                        'last_name' => $customer->last_name,
                        'email' => $customer->email,
                        'addresses' => $customer->addresses->map(function ($address) {
                            return [
                                'id' => $address->id,
                                'street_number' => $address->street_number,
                                'address_line1' => $address->address_line1,
                                'city' => $address->city,
                                'region' => $address->region,
                                'postal_code' => $address->postal_code,
                            ];
                        })
                    ];
                });

            $restaurants = Restaurant::with(['menuItems'])
                ->orderBy('restaurant_name')
                ->get()
                ->map(function ($restaurant) {
                    return [
                        'id' => $restaurant->id,
                        'restaurant_name' => $restaurant->restaurant_name,
                        'menu_items' => $restaurant->menuItems->map(function ($item) {
                            return [
                                'id' => $item->id,
                                'item_name' => $item->item_name,
                                'price' => $item->price,
                            ];
                        })
                    ];
                });

            $orderStatuses = OrderStatus::select('id', 'name')->get();

            $drivers = User::select('id', 'first_name', 'last_name', 'is_available')
                ->where('role', 'driver')
                ->where(function($query) use ($order) {
                    $query->where('is_available', true)
                        ->orWhere('id', $order->assigned_driver_id);
                })
                ->get();

            return Inertia::render('admin/Orders/edit', [
                'order' => $mappedOrder,
                'customers' => $customers,
                'restaurants' => $restaurants,
                'orderStatuses' => $orderStatuses,
                'drivers' => $drivers,
            ]);

        } catch (ModelNotFoundException $e) {
            abort(404, 'Order not found');
        } catch (\Exception $e) {
            Log::error('Error fetching order for edit: ' . $e->getMessage());
            abort(500, 'Failed to load order data');
        }
    }

// Consider adding a scope for available drivers
public function scopeAvailableDrivers($query, $exceptDriverId = null)
{
    $query->where('role', 'driver')
          ->where(function($q) use ($exceptDriverId) {
              $q->where('is_available', true);
              if ($exceptDriverId) {
                  $q->orWhere('id', $exceptDriverId);
              }
          });
}

    public function update(Request $request, $id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $order = FoodOrder::findOrFail($id);
        $oldDriverId = $order->assigned_driver_id;

        $validatedData = $request->validate([
            'customer_id' => 'sometimes|exists:users,id',
            'restaurant_id' => 'sometimes|exists:restaurants,id',
            'customer_address_id' => 'sometimes|nullable|exists:customer_addresses,id',
            'order_status_id' => 'sometimes|exists:order_statuses,id',
            'assigned_driver_id' => 'sometimes|nullable|exists:users,id',
            'order_date_time' => 'sometimes|date',
            'requested_delivery_date_time' => 'sometimes|nullable|date',
            'delivery_fee' => 'sometimes|numeric|min:0',
            'total_amount' => 'sometimes|numeric|min:0',
            'items' => 'sometimes|json',
        ]);

        DB::beginTransaction();
        try {
            // Convert empty strings to null for nullable fields
            if (isset($validatedData['customer_address_id']) && $validatedData['customer_address_id'] === '') {
                // Keep existing customer_address_id since it's NOT NULL in database
                unset($validatedData['customer_address_id']);
            }
            if (isset($validatedData['assigned_driver_id']) && $validatedData['assigned_driver_id'] === '') {
                $validatedData['assigned_driver_id'] = null;
            }
            
            // Handle items if provided
            if (isset($validatedData['items'])) {
                $items = json_decode($validatedData['items'], true);
                unset($validatedData['items']);
                
                // Sync order items
                $order->orderItems()->delete(); // Remove old items
                foreach ($items as $item) {
                    $order->orderItems()->create([
                        'menu_item_id' => $item['menu_item_id'],
                        'qty_ordered' => $item['quantity'],
                        'unit_price' => $item['price'],
                    ]);
                }
            }
            
            // If assigning a new driver, verify they are available
            if (isset($validatedData['assigned_driver_id']) && $validatedData['assigned_driver_id'] !== $oldDriverId) {
                $driver = User::where('id', $validatedData['assigned_driver_id'])
                    ->where('role', 'driver')
                    ->where(function($query) use ($oldDriverId) {
                        $query->where('is_available', true)
                              ->orWhere('id', $oldDriverId); // Allow if already assigned to this order
                    })
                    ->first();

                if (!$driver) {
                    throw new \Exception('Selected driver is not available');
                }
            }

            // Update order
            $order->update($validatedData);

            // Handle driver assignment changes
            if (isset($validatedData['assigned_driver_id'])) {
                // Make old driver available if there was one
                if ($oldDriverId && $oldDriverId != $validatedData['assigned_driver_id']) {
                    User::where('id', $oldDriverId)->update(['is_available' => true]);
                }

                // Make new driver unavailable if assigned
                if ($validatedData['assigned_driver_id']) {
                    User::where('id', $validatedData['assigned_driver_id'])
                        ->update(['is_available' => false]);
                }
            }

            // If order is completed or cancelled, make driver available again
            if (isset($validatedData['order_status_id'])) {
                $completedOrCancelledStatuses = [4, 5]; // Adjust these IDs based on your order statuses
                if (in_array($validatedData['order_status_id'], $completedOrCancelledStatuses)) {
                    if ($order->assigned_driver_id) {
                        User::where('id', $order->assigned_driver_id)
                            ->update(['is_available' => true]);
                    }
                }
            }

            DB::commit();

            if ($request->wantsJson()) {
                return response()->json(['message' => 'Order updated successfully']);
            }

            return redirect()->route('admin.orders.index')->with('success', 'Order updated successfully');
        } catch (\Exception $e) {
            DB::rollback();
            
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage() ?: 'Failed to update order'], 500);
            }
            
            return back()->withErrors(['error' => $e->getMessage() ?: 'Failed to update order']);
        }
    }

    public function destroy($id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        DB::beginTransaction();
        try {
            $order = FoodOrder::findOrFail($id);
            
            // Make driver available if assigned
            if ($order->assigned_driver_id) {
                User::where('id', $order->assigned_driver_id)
                    ->update(['is_available' => true]);
            }

            // Delete order items first
            $order->orderItems()->delete();
            
            // Delete the order
            $order->delete();

            DB::commit();

            return redirect()->route('admin.orders.index')
                ->with('success', 'Order deleted successfully');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to delete order']);
        }
    }

    public function bulkUpdate(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:food_orders,id',
            'status_id' => 'required|exists:order_statuses,id',
        ]);

        try {
            DB::beginTransaction();

            $orders = FoodOrder::whereIn('id', $request->order_ids)->get();
            
            foreach ($orders as $order) {
                $order->update(['order_status_id' => $request->status_id]);
            }

            DB::commit();

            if ($request->wantsJson()) {
                return response()->json(['message' => 'Orders updated successfully']);
            }

            return redirect()->route('admin.orders.index')->with('success', 'Orders updated successfully');
        } catch (\Exception $e) {
            DB::rollback();
            
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage() ?: 'Failed to update orders'], 500);
            }
            
            return back()->withErrors(['error' => $e->getMessage() ?: 'Failed to update orders']);
        }
    }

    public function bulkDelete(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:food_orders,id',
        ]);

        try {
            DB::beginTransaction();

            $orders = FoodOrder::whereIn('id', $request->order_ids)->get();
            
            foreach ($orders as $order) {
                // Make driver available if assigned
                if ($order->assigned_driver_id) {
                    User::where('id', $order->assigned_driver_id)
                        ->update(['is_available' => true]);
                }
                
                $order->delete();
            }

            DB::commit();

            if ($request->wantsJson()) {
                return response()->json(['message' => 'Orders deleted successfully']);
            }

            return redirect()->route('admin.orders.index')->with('success', 'Orders deleted successfully');
        } catch (\Exception $e) {
            DB::rollback();
            
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage() ?: 'Failed to delete orders'], 500);
            }
            
            return back()->withErrors(['error' => $e->getMessage() ?: 'Failed to delete orders']);
        }
    }

    public function stats(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $dateFrom = $request->get('date_from', now()->startOfMonth());
        $dateTo = $request->get('date_to', now()->endOfMonth());

        $stats = [
            'total_orders' => FoodOrder::whereBetween('created_at', [$dateFrom, $dateTo])->count(),
            'completed_orders' => FoodOrder::whereBetween('created_at', [$dateFrom, $dateTo])
                ->where('order_status_id', 4)->count(), // Adjust status ID as needed
            'total_revenue' => FoodOrder::whereBetween('created_at', [$dateFrom, $dateTo])
                ->where('order_status_id', 4)->sum('total_amount'),
            'average_order_value' => FoodOrder::whereBetween('created_at', [$dateFrom, $dateTo])
                ->where('order_status_id', 4)->avg('total_amount'),
        ];

        // Daily breakdown
        $dailyStats = FoodOrder::selectRaw('DATE(created_at) as date, COUNT(*) as orders, SUM(total_amount) as revenue')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->where('order_status_id', 4)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'stats' => $stats,
            'daily_breakdown' => $dailyStats
        ]);
    }

    public function tracking($id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $order = FoodOrder::with([
            'customer:id,first_name,last_name,email,phone',
            'restaurant:id,restaurant_name,address_id',
            'restaurant.address:id,address_line1,address_line2,city,region,postal_code',
            'customerAddress:id,address_line1,address_line2,city,region,postal_code',
            'orderStatus:id,name as status',
            'assignedDriver:id,first_name,last_name,phone',
            'trackingUpdates' => function ($query) {
                $query->with('driver:id,first_name,last_name')
                    ->latest()
                    ->limit(10);
            }
        ])->findOrFail($id);

        // Format tracking updates
        $trackingUpdates = $order->trackingUpdates->map(function ($update) {
            return [
                'id' => $update->id,
                'status' => $update->status,
                'description' => $update->description,
                'latitude' => $update->latitude,
                'longitude' => $update->longitude,
                'created_at' => $update->created_at,
                'driver' => [
                    'name' => $update->driver->first_name . ' ' . $update->driver->last_name,
                ],
            ];
        });

        // Get restaurant location
        $restaurantLocation = $this->geocodingService->getCoordinates(
            $order->restaurant->address->address . ', ' . 
            $order->restaurant->address->city . ', ' . 
            $order->restaurant->address->region . ' ' . 
            $order->restaurant->address->postal_code
        );

        // Get delivery location
        $deliveryLocation = $this->geocodingService->getCoordinates(
            $order->customerAddress->address . ', ' . 
            $order->customerAddress->city . ', ' . 
            $order->customerAddress->region . ' ' . 
            $order->customerAddress->postal_code
        );

        return Inertia::render('admin/Orders/tracking', [
            'order' => [
                'id' => $order->id,
                'customer' => [
                    'name' => $order->customer->first_name . ' ' . $order->customer->last_name,
                    'email' => $order->customer->email,
                    'phone' => $order->customer->phone,
                ],
                'restaurant' => [
                    'name' => $order->restaurant->restaurant_name,
                    'address' => $order->restaurant->address ? 
                        $order->restaurant->address->address_line1 . ', ' . 
                        $order->restaurant->address->city . ', ' . 
                        $order->restaurant->address->region . ' ' . 
                        $order->restaurant->address->postal_code : 'Address not available',
                    'location' => $restaurantLocation,
                ],
                'delivery_address' => [
                    'address' => $order->customerAddress->address_line1,
                    'city' => $order->customerAddress->city,
                    'state' => $order->customerAddress->region,
                    'zip_code' => $order->customerAddress->postal_code,
                    'location' => $deliveryLocation,
                ],
                'order_status' => [
                    'status' => $order->orderStatus->status,
                    'updated_at' => $order->updated_at,
                ],
                'assigned_driver' => $order->assignedDriver ? [
                    'name' => $order->assignedDriver->first_name . ' ' . $order->assignedDriver->last_name,
                    'phone' => $order->assignedDriver->phone,
                    'current_location' => $order->trackingUpdates->first() ? [
                        'latitude' => $order->trackingUpdates->first()->latitude,
                        'longitude' => $order->trackingUpdates->first()->longitude,
                    ] : null,
                ] : null,
                'estimated_delivery_time' => $order->requested_delivery_date_time,
                'created_at' => $order->created_at,
                'tracking_updates' => $trackingUpdates,
            ],
        ]);
    }

    public function statistics()
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        // Get total orders and revenue
        $totalOrders = FoodOrder::count();
        $totalRevenue = FoodOrder::sum('total_amount');
        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        // Get orders by status
        $ordersByStatus = FoodOrder::select('order_statuses.name as status', DB::raw('count(*) as count'))
            ->join('order_statuses', 'food_orders.order_status_id', '=', 'order_statuses.id')
            ->groupBy('order_statuses.name')
            ->get();

        // Get orders by restaurant
        $ordersByRestaurant = FoodOrder::select(
                'restaurants.restaurant_name',
                DB::raw('count(*) as count'),
                DB::raw('sum(food_orders.total_amount) as revenue')
            )
            ->join('restaurants', 'food_orders.restaurant_id', '=', 'restaurants.id')
            ->groupBy('restaurants.restaurant_name')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        // Get orders by hour of day
        $ordersByHour = FoodOrder::select(DB::raw('HOUR(order_date_time) as hour'), DB::raw('count(*) as count'))
            ->groupBy('hour')
            ->orderBy('hour', 'asc')
            ->get();

        // Get orders by day of week
        $ordersByDay = FoodOrder::select(
                DB::raw('DAYNAME(order_date_time) as day'),
                DB::raw('count(*) as count'),
                DB::raw('sum(total_amount) as revenue')
            )
            ->groupBy('day')
            ->orderBy(DB::raw('FIELD(DAYNAME(order_date_time), "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")'))
            ->get();

        // Get orders by month
        $ordersByMonth = FoodOrder::select(DB::raw('MONTH(order_date_time) as month'), DB::raw('count(*) as count'))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        // Get recent orders
        $recentOrders = FoodOrder::with(['customer:id,first_name,last_name', 'restaurant:id,restaurant_name'])
            ->orderBy('order_date_time', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('admin/Orders/statistics', [
            'statistics' => [
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
                'average_order_value' => $averageOrderValue,
                'orders_by_status' => $ordersByStatus,
                'orders_by_restaurant' => $ordersByRestaurant,
                'orders_by_hour' => $ordersByHour,
                'orders_by_day' => $ordersByDay,
                'orders_by_month' => $ordersByMonth,
                'recent_orders' => $recentOrders,
            ],
        ]);
    }

    public function history($id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $order = FoodOrder::with([
            'customer:id,first_name,last_name,email',
            'restaurant:id,restaurant_name',
            'orderStatusHistory' => function ($query) {
                $query->with('updatedBy:id,first_name,last_name,role')
                    ->orderBy('created_at', 'desc');
            }
        ])->findOrFail($id);

        $history = $order->orderStatusHistory->map(function ($item) {
            return [
                'status' => $item->status,
                'description' => $item->description,
                'created_at' => $item->created_at,
                'updated_by' => [
                    'name' => $item->updatedBy->first_name . ' ' . $item->updatedBy->last_name,
                    'role' => $item->updatedBy->role,
                ],
            ];
        });

        return Inertia::render('admin/Orders/history', [
            'order' => [
                'id' => $order->id,
                'customer' => [
                    'name' => $order->customer->first_name . ' ' . $order->customer->last_name,
                    'email' => $order->customer->email,
                ],
                'restaurant' => [
                    'name' => $order->restaurant->restaurant_name,
                ],
                'history' => $history,
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
        $totalOrders = FoodOrder::count();
        $totalRevenue = FoodOrder::sum('total_amount');
        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;
        $ordersByStatus = FoodOrder::select('order_statuses.name as status', DB::raw('count(*) as count'))
            ->join('order_statuses', 'food_orders.order_status_id', '=', 'order_statuses.id')
            ->groupBy('order_statuses.name')
            ->get();
        $ordersByRestaurant = FoodOrder::select('restaurants.restaurant_name', DB::raw('count(*) as count'), DB::raw('sum(food_orders.total_amount) as revenue'))
            ->join('restaurants', 'food_orders.restaurant_id', '=', 'restaurants.id')
            ->groupBy('restaurants.restaurant_name')->orderBy('count', 'desc')->limit(10)->get();

        $filename = 'order_statistics_export_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = ['Content-Type' => 'text/csv', 'Content-Disposition' => 'attachment; filename="' . $filename . '"'];

        $callback = function () use ($totalOrders, $totalRevenue, $averageOrderValue, $ordersByStatus, $ordersByRestaurant) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Metric', 'Value']);
            fputcsv($file, ['Total Orders', $totalOrders]);
            fputcsv($file, ['Total Revenue', $totalRevenue]);
            fputcsv($file, ['Average Order Value', $averageOrderValue]);
            fputcsv($file, []);
            fputcsv($file, ['Status', 'Order Count']);
            foreach ($ordersByStatus as $status) {
                fputcsv($file, [$status->status, $status->count]);
            }
            fputcsv($file, []);
            fputcsv($file, ['Restaurant', 'Order Count', 'Revenue']);
            foreach ($ordersByRestaurant as $restaurant) {
                fputcsv($file, [$restaurant->restaurant_name, $restaurant->count, $restaurant->revenue]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    protected function exportList(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $query = FoodOrder::with(['customer', 'restaurant', 'orderStatus', 'assignedDriver'])
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('order_status_id', $request->status);
            })
            ->when($request->filled('restaurant'), function ($query) use ($request) {
                $query->where('restaurant_id', $request->restaurant);
            })
            ->when($request->filled('date_from'), function ($query) use ($request) {
                $query->whereDate('order_date_time', '>=', $request->date_from);
            })
            ->when($request->filled('date_to'), function ($query) use ($request) {
                $query->whereDate('order_date_time', '<=', $request->date_to);
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->whereHas('customer', function ($q) use ($request) {
                        $q->where('first_name', 'like', "%{$request->search}%")
                            ->orWhere('last_name', 'like', "%{$request->search}%")
                            ->orWhere('email', 'like', "%{$request->search}%");
                    })
                    ->orWhereHas('restaurant', function ($q) use ($request) {
                        $q->where('restaurant_name', 'like', "%{$request->search}%");
                    });
                });
            });

        $orders = $query->get();

        $filename = 'orders_export_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($orders) {
            $file = fopen('php://output', 'w');
            
            // CSV headers
            fputcsv($file, [
                'Order ID',
                'Customer Name',
                'Customer Email',
                'Restaurant',
                'Status',
                'Total Amount',
                'Order Date',
                'Driver',
            ]);

            // CSV data
            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->id,
                    $order->customer->first_name . ' ' . $order->customer->last_name,
                    $order->customer->email,
                    $order->restaurant->restaurant_name,
                    $order->orderStatus->name,
                    $order->total_amount,
                    $order->order_date_time,
                    $order->assignedDriver ? $order->assignedDriver->first_name . ' ' . $order->assignedDriver->last_name : 'Not assigned',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * API method to get tracking data for an order
     */
    public function getTrackingData($id)
    {
        $order = FoodOrder::with([
            'customer:id,first_name,last_name,email,phone',
            'restaurant:id,restaurant_name,address_id',
            'restaurant.address:id,address_line1,address_line2,city,region,postal_code',
            'customerAddress:id,address_line1,address_line2,city,region,postal_code',
            'orderStatus:id,name as status',
            'assignedDriver:id,first_name,last_name,phone',
            'trackingUpdates' => function ($query) {
                $query->with('driver:id,first_name,last_name')
                    ->latest()
                    ->limit(10);
            }
        ])->findOrFail($id);

        // Format tracking updates
        $trackingUpdates = $order->trackingUpdates->map(function ($update) {
            return [
                'id' => $update->id,
                'status' => $update->status,
                'description' => $update->description,
                'latitude' => $update->latitude,
                'longitude' => $update->longitude,
                'created_at' => $update->created_at,
                'driver' => [
                    'name' => $update->driver->first_name . ' ' . $update->driver->last_name,
                ],
            ];
        });

        // Get restaurant location
        $restaurantLocation = $this->geocodingService->getCoordinates(
            $order->restaurant->address->address . ', ' . 
            $order->restaurant->address->city . ', ' . 
            $order->restaurant->address->region . ' ' . 
            $order->restaurant->address->postal_code
        );

        // Get delivery location
        $deliveryLocation = $this->geocodingService->getCoordinates(
            $order->customerAddress->address . ', ' . 
            $order->customerAddress->city . ', ' . 
            $order->customerAddress->region . ' ' . 
            $order->customerAddress->postal_code
        );

        return response()->json([
            'order' => [
                'id' => $order->id,
                'customer' => [
                    'name' => $order->customer->first_name . ' ' . $order->customer->last_name,
                    'email' => $order->customer->email,
                    'phone' => $order->customer->phone,
                ],
                'restaurant' => [
                    'name' => $order->restaurant->restaurant_name,
                    'address' => $order->restaurant->address ? 
                        $order->restaurant->address->address_line1 . ', ' . 
                        $order->restaurant->address->city . ', ' . 
                        $order->restaurant->address->region . ' ' . 
                        $order->restaurant->address->postal_code : 'Address not available',
                    'location' => $restaurantLocation,
                ],
                'delivery_address' => [
                    'address' => $order->customerAddress->address_line1,
                    'city' => $order->customerAddress->city,
                    'state' => $order->customerAddress->region,
                    'zip_code' => $order->customerAddress->postal_code,
                    'location' => $deliveryLocation,
                ],
                'order_status' => [
                    'status' => $order->orderStatus->status,
                    'updated_at' => $order->updated_at,
                ],
                'assigned_driver' => $order->assignedDriver ? [
                    'name' => $order->assignedDriver->first_name . ' ' . $order->assignedDriver->last_name,
                    'phone' => $order->assignedDriver->phone,
                    'current_location' => $order->trackingUpdates->first() ? [
                        'latitude' => $order->trackingUpdates->first()->latitude,
                        'longitude' => $order->trackingUpdates->first()->longitude,
                    ] : null,
                ] : null,
                'estimated_delivery_time' => $order->requested_delivery_date_time,
                'created_at' => $order->created_at,
                'tracking_updates' => $trackingUpdates,
            ],
        ]);
    }

    /**
     * API method to add a tracking update for an order
     */
    public function addTrackingUpdate(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string',
            'description' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $order = FoodOrder::findOrFail($id);
        
        // Ensure the user is the assigned driver or an admin
        if (auth()->user()->role !== 'admin' && 
            $order->assigned_driver_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $trackingUpdate = $order->trackingUpdates()->create([
            'driver_id' => auth()->id(),
            'status' => $request->status,
            'description' => $request->description,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json([
            'message' => 'Tracking update added successfully',
            'tracking_update' => $trackingUpdate,
        ], 201);
    }
}