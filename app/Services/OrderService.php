<?php

namespace App\Services;

use App\Models\FoodOrder;
use App\Models\MenuItem;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class OrderService
{
    public function getCustomerOrders(User $user): Collection
    {
        return $user->orders()
            ->with(['restaurant', 'status', 'driver', 'orderItems.menuItem'])
            ->latest()
            ->get();
    }

    public function getRestaurantOrders(User $user, Restaurant $restaurant): Collection
    {
        Gate::authorize('viewAny', [FoodOrder::class, $restaurant]);
        
        return $restaurant->orders()
            ->with(['customer', 'status', 'driver', 'orderItems.menuItem'])
            ->latest()
            ->get();
    }

    public function createOrder(User $user, array $data): FoodOrder
    {
        return DB::transaction(function () use ($user, $data) {
            $order = FoodOrder::create([
                'customer_id' => $user->id,
                'restaurant_id' => $data['restaurant_id'],
                'customer_address_id' => $data['customer_address_id'],
                'order_status_id' => 1, // Pending
                'order_date_time' => now(),
                'delivery_fee' => $data['delivery_fee'],
                'total_amount' => 0 // Will be calculated
            ]);

            $totalAmount = 0;
            
            foreach ($data['items'] as $item) {
                $menuItem = MenuItem::findOrFail($item['menu_item_id']);
                
                $order->orderItems()->create([
                    'menu_item_id' => $menuItem->id,
                    'qty_ordered' => $item['quantity'],
                    'unit_price' => $menuItem->price
                ]);
                
                $totalAmount += $menuItem->price * $item['quantity'];
            }

            $order->update([
                'total_amount' => $totalAmount + $order->delivery_fee
            ]);

            return $order->load('orderItems.menuItem');
        });
    }

    public function updateOrderStatus(User $user, FoodOrder $order, int $statusId): FoodOrder
    {
        Gate::authorize('update', $order);
        
        $order->update(['order_status_id' => $statusId]);
        return $order->fresh();
    }

    public function cancelOrder(User $user, FoodOrder $order): FoodOrder
    {
        Gate::authorize('delete', $order);
        
        $order->update(['order_status_id' => 5]); // Cancelled
        return $order->fresh();
    }

    public function rateOrder(User $user, FoodOrder $order, array $ratings): FoodOrder
    {
        Gate::authorize('rate', $order);
        
        $order->update([
            'cust_driver_rating' => $ratings['driver_rating'] ?? null,
            'cust_restaurant_rating' => $ratings['restaurant_rating'] ?? null
        ]);
        
        return $order->fresh();
    }

    public function getAllOrders()
    {
        // Your implementation to get all orders
        return FoodOrder::with([/* relationships */])->get();
    }

    public function assignDriver(User $user, FoodOrder $order, int $driverId)
    {
        // Your implementation to assign driver
        $order->update(['driver_id' => $driverId]);
    }
}