<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\FoodOrder;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $query = FoodOrder::with([
            'customer:id,first_name,last_name,email',
            'restaurant:id,restaurant_name',
            'orderStatus:id,status_value',
            'Driver:id,first_name,last_name'
        ]);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('order_status_id', $request->status);
        }

        if ($request->filled('restaurant')) {
            $query->where('restaurant_id', $request->restaurant);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('customer', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhereHas('restaurant', function ($q) use ($search) {
                $q->where('restaurant_name', 'like', "%{$search}%");
            })->orWhere('id', 'like', "%{$search}%");
        }

        // Apply sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        $allowedSorts = ['id', 'created_at', 'total_amount', 'delivery_fee'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $orders = $query->paginate(15)->withQueryString();

        // Get filter options
        $orderStatuses = OrderStatus::select('id', 'status_value')->get();
        $restaurants = DB::table('restaurants')
            ->select('id', 'restaurant_name')
            ->orderBy('restaurant_name')
            ->get();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => OrderResource::collection($orders),
            'orderStatuses' => $orderStatuses,
            'restaurants' => $restaurants,
            'filters' => $request->only(['status', 'restaurant', 'date_from', 'date_to', 'search', 'sort', 'direction']),
        ]);
    }

    public function show($id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }

        $order = FoodOrder::with([
            'customer:id,first_name,last_name,email,phone',
            'restaurant:id,restaurant_name,phone,email',
            'restaurant.address:id,address_line1,address_line2,city,region,postal_code',
            'restaurant.address.country:id,country_name',
            'orderStatus:id,status_value',
            'driver:id,first_name,last_name,phone',
            'customerAddress:id,address_line1,address_line2,city,region,postal_code',
            'customerAddress.country:id,country_name',
            'orderMenuItems.menuItem:id,item_name,price'
        ])->findOrFail($id);

        // Get available drivers for assignment
        $availableDrivers = Driver::select('id', 'first_name', 'last_name')
            ->where('is_available', true)
            ->get();

        // Get all order statuses
        $orderStatuses = OrderStatus::select('id', 'status_value')->get();

        return Inertia::render('Admin/Orders/Show', [
            'order' => new OrderResource($order),
            'availableDrivers' => $availableDrivers,
            'orderStatuses' => $orderStatuses,
        ]);
    }

    public function update(Request $request, $id)
    {
        // Ensure user is admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $order = FoodOrder::findOrFail($id);

        $validatedData = $request->validate([
            'order_status_id' => 'sometimes|exists:order_statuses,id',
            'assigned_driver_id' => 'sometimes|nullable|exists:drivers,id',
            'delivery_fee' => 'sometimes|numeric|min:0',
            'requested_delivery_datetime' => 'sometimes|nullable|date',
        ]);

        // Update order
        $order->update($validatedData);

        // If assigning a driver, mark them as unavailable
        if (isset($validatedData['assigned_driver_id']) && $validatedData['assigned_driver_id']) {
            Driver::where('id', $validatedData['assigned_driver_id'])
                ->update(['is_available' => false]);
        }

        // If order is completed or cancelled, make driver available again
        if (isset($validatedData['order_status_id']) && 
            in_array($validatedData['order_status_id'], [4, 5])) { // Completed or Cancelled
            if ($order->assigned_driver_id) {
                Driver::where('id', $order->assigned_driver_id)
                    ->update(['is_available' => true]);
            }
        }

        return back()->with('success', 'Order updated successfully');
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
            'action' => 'required|in:update_status,assign_driver',
            'order_status_id' => 'required_if:action,update_status|exists:order_statuses,id',
            'assigned_driver_id' => 'required_if:action,assign_driver|exists:delivery_drivers,id',
        ]);

        $orderIds = $validatedData['order_ids'];

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
            Driver::where('id', $validatedData['assigned_driver_id'])
                ->update(['is_available' => false]);

            $message = 'Driver assigned to selected orders successfully';
        }

        return back()->with('success', $message);
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
                ->where('order_status_id', 4)->count(),
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
}