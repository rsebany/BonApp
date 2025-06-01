<?php

namespace App\Services;

use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Gate;

class RestaurantService
{
    public function getAllRestaurants(User $user): Collection
    {
        if ($user->isAdmin()) {
            return Restaurant::with(['address', 'menuItems'])->get();
        }

        return Restaurant::whereHas('orders', function($query) use ($user) {
            $query->where('customer_id', $user->id);
        })->with(['address', 'menuItems'])->get();
    }

    public function createRestaurant(User $user, array $data): Restaurant
    {
        Gate::authorize('create', Restaurant::class);
        
        return Restaurant::create([
            'restaurant_name' => $data['restaurant_name'],
            'address_id' => $data['address_id']
        ]);
    }

    public function updateRestaurant(User $user, Restaurant $restaurant, array $data): Restaurant
    {
        Gate::authorize('update', $restaurant);
        
        $restaurant->update($data);
        return $restaurant->fresh();
    }

    public function deleteRestaurant(User $user, Restaurant $restaurant): void
    {
        Gate::authorize('delete', $restaurant);
        
        $restaurant->delete();
    }

    public function getRestaurantMenu(User $user, Restaurant $restaurant): Collection
    {
        Gate::authorize('view', $restaurant);
        
        return $restaurant->menuItems;
    }
}