<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\RateOrderRequest;
use App\Models\FoodOrder;
use App\Models\OrderStatus;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    // List the authenticated user's orders
    public function index(Request $request)
    {
        $user = Auth::user();
        $orders = $this->orderService->getCustomerOrders($user);
        return Inertia::render('User/Orders/index', [
            'orders' => OrderResource::collection($orders),
        ]);
    }

    // Show a single order (only if it belongs to the user)
    public function show($id)
    {
        $user = Auth::user();
        $order = FoodOrder::with(['restaurant', 'orderItems.menuItem', 'orderStatus', 'customerAddress'])
            ->where('customer_id', $user->id)
            ->findOrFail($id);
        return Inertia::render('User/Orders/show', [
            'order' => new OrderResource($order),
        ]);
    }

    // Store a new order for the authenticated user
    public function store(StoreOrderRequest $request)
    {
        $user = Auth::user();
        $validated = $request->validated();
        $validated['total_amount'] = $this->orderService->calculateOrderTotal($validated['items'], $validated['delivery_fee']);
        $order = $this->orderService->createOrder($validated, $user);
        return response()->json([
            'order' => new OrderResource($order),
            'message' => 'Order placed successfully.'
        ], 201);
    }

    // Rate an order (only if it belongs to the user)
    public function rate(RateOrderRequest $request, $id)
    {
        $user = Auth::user();
        $order = FoodOrder::where('customer_id', $user->id)->findOrFail($id);
        $this->orderService->rateOrder($order, $request->validated(), $user);
        return response()->json(['message' => 'Thank you for your feedback!']);
    }

    // Optionally: destroy (cancel) an order
    public function destroy($id)
    {
        $user = Auth::user();
        $order = FoodOrder::where('customer_id', $user->id)->findOrFail($id);
        $this->orderService->cancelOrder($order, $user);
        return redirect()->route('orders.index')->with('success', 'Order cancelled.');
    }

    public function create()
    {
        $user = auth()->user();
        $restaurants = \App\Models\Restaurant::where('is_active', true)->get(['id', 'restaurant_name']);
        $menuItems = \App\Models\MenuItem::where('is_available', true)
            ->get(['id', 'item_name', 'price', 'restaurant_id']);
        $customerAddresses = \App\Models\CustomerAddress::with('address')
            ->where('customer_id', $user->id)
            ->get();
        $addresses = $customerAddresses->map(function ($ca) {
            return [
                'id' => $ca->address->id,
                'address_line1' => $ca->address->address_line1,
                'city' => $ca->address->city,
                'region' => $ca->address->region,
                'postal_code' => $ca->address->postal_code,
            ];
        });

        // Example delivery time slots (could be generated dynamically)
        $deliveryTimes = [
            'ASAP',
            '12:00 PM - 12:30 PM',
            '12:30 PM - 1:00 PM',
            '1:00 PM - 1:30 PM',
            '1:30 PM - 2:00 PM',
        ];

        return Inertia::render('User/Orders/create', [
            'restaurants' => $restaurants,
            'menuItems' => $menuItems,
            'addresses' => $addresses,
            'deliveryTimes' => $deliveryTimes,
        ]);
    }

    // Show the status history for a user's order
    public function orderHistory($id)
    {
        $user = Auth::user();
        $order = FoodOrder::with(['restaurant', 'orderStatusHistory' => function ($query) {
            $query->with('updatedBy:id,first_name,last_name,role')->orderBy('created_at', 'desc');
        }])
        ->where('customer_id', $user->id)
        ->findOrFail($id);

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

        return Inertia::render('User/OrderHistory/index', [
            'order' => [
                'id' => $order->id,
                'restaurant' => [
                    'name' => $order->restaurant->restaurant_name,
                ],
                'history' => $history,
            ],
        ]);
    }

    // Show a list of all orders for the authenticated user, each with a link to its history
    public function orderHistoryIndex()
    {
        $user = Auth::user();
        $orders = FoodOrder::with('restaurant', 'orderStatus')
            ->where('customer_id', $user->id)
            ->orderByDesc('order_date_time')
            ->get();

        $orderList = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'restaurant' => [
                    'name' => $order->restaurant->restaurant_name,
                ],
                'status' => $order->orderStatus->name,
                'order_date' => $order->order_date_time ? $order->order_date_time->format('Y-m-d H:i') : null,
                'total' => $order->total_amount,
            ];
        });

        return Inertia::render('User/OrderHistory/list', [
            'orders' => $orderList,
        ]);
    }

    // Get current orders for sidebar (API endpoint)
    public function getCurrentOrders(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        // Get active orders (not delivered or cancelled)
        $activeStatuses = OrderStatus::whereNotIn('name', ['delivered', 'cancelled'])->pluck('id');
        
        $currentOrders = FoodOrder::with(['restaurant', 'orderItems.menuItem', 'orderStatus'])
            ->where('customer_id', $user->id)
            ->whereIn('order_status_id', $activeStatuses)
            ->latest('order_date_time')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                $items = $order->orderItems->map(function ($orderItem) {
                    return $orderItem->menuItem->item_name . ' (x' . $orderItem->qty_ordered . ')';
                })->toArray();

                $status = $order->orderStatus->name;
                $estimatedTime = $this->getEstimatedTime($status, $order->order_date_time);

                return [
                    'id' => $order->id,
                    'restaurant_name' => $order->restaurant->restaurant_name,
                    'items' => $items,
                    'total' => $order->total_amount,
                    'status' => $status,
                    'estimated_time' => $estimatedTime,
                    'image_url' => $order->restaurant->image_url ?? null,
                ];
            });

        return response()->json([
            'orders' => $currentOrders,
        ]);
    }

    // Get order history for sidebar (API endpoint)
    public function getOrderHistory(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        $recentOrders = FoodOrder::with(['restaurant', 'orderItems.menuItem', 'orderStatus'])
            ->where('customer_id', $user->id)
            ->latest('order_date_time')
            ->limit(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'restaurant_name' => $order->restaurant->restaurant_name,
                    'total' => $order->total_amount,
                    'status' => $order->orderStatus->name,
                    'order_date' => $order->order_date_time->format('M d, Y'),
                    'image_url' => $order->restaurant->image_url ?? null,
                ];
            });

        return response()->json([
            'orders' => $recentOrders,
        ]);
    }

    private function getEstimatedTime($status, $orderDateTime): ?string
    {
        $orderTime = \Carbon\Carbon::parse($orderDateTime);
        $now = now();
        
        switch ($status) {
            case 'pending':
                return '15-20 min';
            case 'confirmed':
                return '10-15 min';
            case 'preparing':
                return '5-10 min';
            case 'ready':
                return '2-5 min';
            case 'out_for_delivery':
                $elapsed = $now->diffInMinutes($orderTime);
                $estimated = max(5, 30 - $elapsed);
                return "~{$estimated} min";
            default:
                return null;
        }
    }
}
