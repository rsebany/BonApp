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

class OrderController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
    {
        $query = FoodOrder::with([
            'customer:id,first_name,last_name,email',
            'restaurant:id,restaurant_name',
            'orderStatus:id,name',  // Changed from 'status' to 'name'
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

        $orders = $query->paginate(15)
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
            'filters' => $request->only(['search', 'status', 'restaurant', 'date_from', 'date_to', 'sort', 'direction']),
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
            'restaurant.address:id,address_line1,address_line2,city,region,postal_code',
            'restaurant.address.country:id,country_name',
            'orderStatus:id,name as status', 
            'assignedDriver:id,first_name,last_name,phone',
            'customerAddress:id,address_line1,address_line2,city,region,postal_code',
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
        // Validate the request
        $validated = $request->validate([
            'customer_id' => 'required|exists:users,id',
            'restaurant_id' => 'required|exists:restaurants,id',
            'customer_address_id' => 'required|exists:addresses,id',
            'order_status_id' => 'required|exists:order_statuses,id',
            'assigned_driver_id' => 'nullable|exists:users,id',
            'order_date_time' => 'required|date',
            'requested_delivery_date_time' => 'required|date|after:order_date_time',
            'delivery_fee' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            // Create the order
            $order = FoodOrder::create([
                'customer_id' => $validated['customer_id'],
                'restaurant_id' => $validated['restaurant_id'],
                'customer_address_id' => $validated['customer_address_id'],
                'order_status_id' => $validated['order_status_id'],
                'assigned_driver_id' => $validated['assigned_driver_id'],
                'order_date_time' => $validated['order_date_time'],
                'requested_delivery_date_time' => $validated['requested_delivery_date_time'],
                'delivery_fee' => $validated['delivery_fee'],
                'total_amount' => $validated['total_amount'],
            ]);

            // Add order items
            foreach ($validated['items'] as $item) {
                $order->items()->create([
                    'menu_item_id' => $item['menu_item_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['subtotal'],
                ]);
            }

            DB::commit();

            return redirect()->route('admin.orders.index')
                ->with('success', 'Order created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()
                ->with('error', 'Failed to create order: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function edit($id)
    {
        try {
            $order = FoodOrder::with([
                'customer:id,first_name,last_name,email',
                'restaurant:id,restaurant_name,address_id',
                'restaurant.address:id,street_number,address_line1,city,region,postal_code',
                'orderStatus:id,name as status',
                'assignedDriver:id,first_name,last_name,is_available',
                'customerAddress:id,address_line1,address_line2,city,region,postal_code',
                'orderItems.menuItem:id,item_name,price'
            ])->findOrFail($id);

            $this->authorize('update', $order);

            $customers = User::select('id', 'first_name', 'last_name', 'email')
                ->where('role', 'customer')
                ->orderBy('first_name')
                ->get();

            $restaurants = Restaurant::select('id', 'restaurant_name')
                ->orderBy('restaurant_name')
                ->get();

            $orderStatuses = OrderStatus::select('id', 'name as status')->get();

            $drivers = User::select('id', 'first_name', 'last_name', 'is_available')
                ->where('role', 'driver')
                ->where(function($query) use ($order) {
                    $query->where('is_available', true)
                        ->orWhere('id', $order->assigned_driver_id);
                })
                ->get();

            return Inertia::render('admin/Orders/edit', [
                'order' => $order,
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
            'customer_address_id' => 'sometimes|exists:customer_addresses,id',
            'order_status_id' => 'sometimes|exists:order_statuses,id',
            'assigned_driver_id' => 'sometimes|nullable|exists:users,id',
            'order_datetime' => 'sometimes|date',
            'requested_delivery_datetime' => 'sometimes|nullable|date',
            'delivery_fee' => 'sometimes|numeric|min:0',
            'total_amount' => 'sometimes|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // If assigning a new driver, verify they are available
            if (isset($validatedData['assigned_driver_id']) && $validatedData['assigned_driver_id'] !== $oldDriverId) {
                $driver = User::where('id', $validatedData['assigned_driver_id'])
                    ->where('role', 'driver')
                    ->where('is_available', true)
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

            return back()->with('success', 'Order updated successfully');
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
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:food_orders,id',
            'action' => 'required|in:update_status,assign_driver,delete',
            'order_status_id' => 'required_if:action,update_status|exists:name,id',
            'assigned_driver_id' => 'required_if:action,assign_driver|exists:users,id',
        ]);

        $orderIds = $validatedData['order_ids'];

        DB::beginTransaction();
        try {
            if ($validatedData['action'] === 'update_status') {
                FoodOrder::whereIn('id', $orderIds)->update([
                    'order_status_id' => $validatedData['order_status_id']
                ]);
                $message = 'Order statuses updated successfully';

            } elseif ($validatedData['action'] === 'assign_driver') {
                FoodOrder::whereIn('id', $orderIds)->update([
                    'assigned_driver_id' => $validatedData['assigned_driver_id']
                ]);

                // Mark driver as unavailable
                User::where('id', $validatedData['assigned_driver_id'])
                    ->update(['is_available' => false]);

                $message = 'Driver assigned to selected orders successfully';

            } elseif ($validatedData['action'] === 'delete') {
                // Get orders to be deleted to free up drivers
                $orders = FoodOrder::whereIn('id', $orderIds)->get();
                
                foreach ($orders as $order) {
                    if ($order->assigned_driver_id) {
                        User::where('id', $order->assigned_driver_id)
                            ->update(['is_available' => true]);
                    }
                    $order->orderItems()->delete();
                }

                FoodOrder::whereIn('id', $orderIds)->delete();
                $message = 'Selected orders deleted successfully';
            }

            DB::commit();
            return back()->with('success', $message);
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to perform bulk operation']);
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
            'restaurant:id,restaurant_name,address',
            'deliveryAddress:id,address_line1,address_line2,city,region,postal_code',
            'orderStatus:id,name as status',
            'assignedDriver:id,first_name,last_name,phone',
            'trackingUpdates' => function ($query) {
                $query->latest()->limit(10);
            }
        ])->findOrFail($id);

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
                    'address' => $order->restaurant->address,
                ],
                'delivery_address' => [
                    'address' => $order->deliveryAddress->address_line1,
                    'city' => $order->deliveryAddress->city,
                    'state' => $order->deliveryAddress->region,
                    'zip_code' => $order->deliveryAddress->postal_code,
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
                'estimated_delivery_time' => $order->requested_delivery_datetime,
                'created_at' => $order->created_at,
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

        if ($request->filled('order_ids')) {
            $query->whereIn('id', $request->order_ids);
        }

        $orders = $query->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="orders.csv"',
        ];

        $callback = function() use ($orders) {
            $file = fopen('php://output', 'w');
            
            // Add headers
            fputcsv($file, [
                'Order ID',
                'Customer',
                'Restaurant',
                'Status',
                'Driver',
                'Order Date',
                'Delivery Date',
                'Delivery Fee',
                'Total Amount',
            ]);

            // Add data
            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->id,
                    $order->customer->first_name . ' ' . $order->customer->last_name,
                    $order->restaurant->restaurant_name,
                    $order->orderStatus->name,
                    $order->assignedDriver ? $order->assignedDriver->first_name . ' ' . $order->assignedDriver->last_name : 'Not assigned',
                    $order->order_date_time,
                    $order->requested_delivery_date_time,
                    $order->delivery_fee,
                    $order->total_amount,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}