<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    public static function createOrderNotification($order, $type = 'new')
    {
        $customerName = $order->customer->full_name ?? 'Unknown Customer';
        $restaurantName = $order->restaurant->restaurant_name ?? 'Unknown Restaurant';
        
        $notifications = [
            'new' => [
                'title' => 'New Order Received',
                'message' => "Order #{$order->id} has been placed by {$customerName} from {$restaurantName}",
                'data' => [
                    'order_id' => $order->id,
                    'customer_name' => $customerName,
                    'restaurant_name' => $restaurantName,
                    'total_amount' => $order->total_amount,
                ],
            ],
            'delivered' => [
                'title' => 'Order Delivered',
                'message' => "Order #{$order->id} has been successfully delivered to {$customerName}",
                'data' => [
                    'order_id' => $order->id,
                    'customer_name' => $customerName,
                    'delivery_time' => now(),
                ],
            ],
            'cancelled' => [
                'title' => 'Order Cancelled',
                'message' => "Order #{$order->id} has been cancelled",
                'data' => [
                    'order_id' => $order->id,
                    'customer_name' => $customerName,
                    'cancellation_time' => now(),
                ],
            ],
        ];

        if (isset($notifications[$type])) {
            return Notification::create([
                'type' => 'order',
                'title' => $notifications[$type]['title'],
                'message' => $notifications[$type]['message'],
                'data' => $notifications[$type]['data'],
                'is_read' => false,
            ]);
        }

        return null;
    }

    public static function createUserNotification($user, $type = 'registered')
    {
        $userName = $user->full_name ?? 'Unknown User';
        
        $notifications = [
            'registered' => [
                'title' => 'New User Registration',
                'message' => "{$userName} has registered as a new {$user->role}",
                'data' => [
                    'user_id' => $user->id,
                    'user_name' => $userName,
                    'user_role' => $user->role,
                    'user_email' => $user->email,
                ],
            ],
            'verified' => [
                'title' => 'Email Verified',
                'message' => "{$userName} has verified their email address",
                'data' => [
                    'user_id' => $user->id,
                    'user_name' => $userName,
                    'verification_time' => now(),
                ],
            ],
        ];

        if (isset($notifications[$type])) {
            return Notification::create([
                'type' => 'user',
                'title' => $notifications[$type]['title'],
                'message' => $notifications[$type]['message'],
                'data' => $notifications[$type]['data'],
                'is_read' => false,
            ]);
        }

        return null;
    }

    public static function createRestaurantNotification($restaurant, $type = 'updated')
    {
        $restaurantName = $restaurant->restaurant_name ?? 'Unknown Restaurant';
        
        $notifications = [
            'updated' => [
                'title' => 'Restaurant Updated',
                'message' => "{$restaurantName} has updated their information",
                'data' => [
                    'restaurant_id' => $restaurant->id,
                    'restaurant_name' => $restaurantName,
                    'update_time' => now(),
                ],
            ],
            'menu_updated' => [
                'title' => 'Menu Updated',
                'message' => "{$restaurantName} has updated their menu",
                'data' => [
                    'restaurant_id' => $restaurant->id,
                    'restaurant_name' => $restaurantName,
                    'update_time' => now(),
                ],
            ],
        ];

        if (isset($notifications[$type])) {
            return Notification::create([
                'type' => 'restaurant',
                'title' => $notifications[$type]['title'],
                'message' => $notifications[$type]['message'],
                'data' => $notifications[$type]['data'],
                'is_read' => false,
            ]);
        }

        return null;
    }

    public static function createSystemNotification($title, $message, $data = [])
    {
        return Notification::create([
            'type' => 'system',
            'title' => $title,
            'message' => $message,
            'data' => $data,
            'is_read' => false,
        ]);
    }
} 