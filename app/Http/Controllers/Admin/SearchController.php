<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\FoodOrder;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SearchController extends Controller
{
    public function globalSearch(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        
        if (empty($query) || strlen($query) < 2) {
            return response()->json([
                'users' => [],
                'orders' => [],
                'restaurants' => [],
            ]);
        }

        // Search users
        $users = User::where(function($q) use ($query) {
            $q->where('first_name', 'like', "%{$query}%")
              ->orWhere('last_name', 'like', "%{$query}%")
              ->orWhere('email', 'like', "%{$query}%");
        })
        ->limit(5)
        ->get()
        ->map(function($user) {
            return [
                'id' => $user->id,
                'type' => 'user',
                'title' => $user->full_name,
                'subtitle' => $user->email,
                'url' => route('admin.users.show', $user->id),
                'role' => $user->role,
            ];
        });

        // Search orders
        $orders = FoodOrder::with(['customer:id,first_name,last_name', 'restaurant:id,restaurant_name'])
            ->where(function($q) use ($query) {
                $q->where('id', 'like', "%{$query}%")
                  ->orWhereHas('customer', function($q) use ($query) {
                      $q->where('first_name', 'like', "%{$query}%")
                        ->orWhere('last_name', 'like', "%{$query}%")
                        ->orWhere('email', 'like', "%{$query}%");
                  })
                  ->orWhereHas('restaurant', function($q) use ($query) {
                      $q->where('restaurant_name', 'like', "%{$query}%");
                  });
            })
            ->limit(5)
            ->get()
            ->map(function($order) {
                return [
                    'id' => $order->id,
                    'type' => 'order',
                    'title' => "Order #{$order->id}",
                    'subtitle' => "{$order->customer->full_name} - {$order->restaurant->restaurant_name}",
                    'url' => route('admin.orders.show', $order->id),
                    'status' => $order->orderStatus->name ?? 'Unknown',
                ];
            });

        // Search restaurants
        $restaurants = Restaurant::where(function($q) use ($query) {
            $q->where('restaurant_name', 'like', "%{$query}%")
              ->orWhere('email', 'like', "%{$query}%")
              ->orWhere('phone', 'like', "%{$query}%");
        })
        ->limit(5)
        ->get()
        ->map(function($restaurant) {
            return [
                'id' => $restaurant->id,
                'type' => 'restaurant',
                'title' => $restaurant->restaurant_name,
                'subtitle' => $restaurant->email,
                'url' => route('admin.restaurants.show', $restaurant->id),
                'status' => $restaurant->is_active ? 'Active' : 'Inactive',
            ];
        });

        return response()->json([
            'users' => $users,
            'orders' => $orders,
            'restaurants' => $restaurants,
        ]);
    }
}
