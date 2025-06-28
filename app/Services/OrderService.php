<?php

namespace App\Services;

use App\Models\FoodOrder;
use App\Models\OrderStatus;
use App\Models\OrderMenuItem;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function getCustomerOrders(User $user)
    {
        return FoodOrder::where('customer_id', $user->id)
            ->with(['restaurant', 'status', 'orderItems.menuItem'])
            ->latest()
            ->get();
    }

    public function createOrder(array $orderData, User $user): FoodOrder
    {
        $orderData['customer_id'] = $user->id;
        
        return DB::transaction(function () use ($orderData) {
            // Create the order
            $order = FoodOrder::create([
                'customer_id' => $orderData['customer_id'],
                'restaurant_id' => $orderData['restaurant_id'],
                'customer_address_id' => $orderData['customer_address_id'],
                'order_status_id' => $this->getPendingStatusId(),
                'order_datetime' => now(),
                'delivery_fee' => $orderData['delivery_fee'] ?? 0,
                'total_amount' => $orderData['total_amount'],
                'delivery_time' => $orderData['delivery_time'],
                'notes' => $orderData['notes'] ?? null,
            ]);

            // Create order items
            foreach ($orderData['items'] as $item) {
                OrderMenuItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'qty_ordered' => $item['quantity'],
                ]);
            }

            return $order->load(['orderItems.menuItem', 'restaurant', 'customerAddress']);
        });
    }

    public function calculateOrderTotal(array $items, float $deliveryFee = 0): float
    {
        $subtotal = 0;

        foreach ($items as $item) {
            $menuItem = MenuItem::find($item['menu_item_id']);
            if ($menuItem) {
                $subtotal += $menuItem->price * $item['quantity'];
            }
        }

        return $subtotal + $deliveryFee;
    }

    public function updateOrderStatus(FoodOrder $order, int $statusId, User $user): bool
    {
        return $order->update(['order_status_id' => $statusId]);
    }

    public function cancelOrder(FoodOrder $order, User $user): bool
    {
        $cancelledStatus = OrderStatus::where('name', OrderStatus::CANCELLED)->first();
        
        if (!$cancelledStatus) {
            return false;
        }

        return $order->update([
            'order_status_id' => $cancelledStatus->id,
            'cancelled_by_id' => $user->id,
            'cancelled_at' => now()
        ]);
    }

    public function assignDriver(FoodOrder $order, int $driverId): bool
    {
        return $order->update(['assigned_driver_id' => $driverId]);
    }

    public function rateOrder(FoodOrder $order, array $ratingData, User $user): bool
    {
        $updateData = [];

        if (isset($ratingData['restaurant_rating'])) {
            $updateData['customer_restaurant_rating'] = $ratingData['restaurant_rating'];
        }

        if (isset($ratingData['driver_rating']) && $order->assigned_driver_id) {
            $updateData['customer_driver_rating'] = $ratingData['driver_rating'];
        }

        return !empty($updateData) ? $order->update($updateData) : false;
    }

    private function getPendingStatusId(): int
    {
        return OrderStatus::where('name', OrderStatus::PENDING)->first()->id;
    }
}