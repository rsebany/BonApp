<?php

namespace App\Services;

use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Gate;

class RestaurantService
{
    public function getAllRestaurants(User $user = null, string $searchTerm = null): Collection
    {
        $query = Restaurant::query()->with(['address.country']);

        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('restaurant_name', 'like', "%{$searchTerm}%")
                  ->orWhere('cuisine_type', 'like', "%{$searchTerm}%");
            });
        }

        if ($user) {
            if ($user->isAdmin()) {
                // Admin sees all
            } else {
                // Non-admin user logic (if any)
                // For now, let's assume they can search all active restaurants.
                $query->where('is_active', true);
            }
        } else {
            // Unauthenticated user
            $query->where('is_active', true);
        }
        
        return $query->get();
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
        
        return $restaurant->menuItems()->get();
    }
}