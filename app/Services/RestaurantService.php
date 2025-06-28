<?php

namespace App\Services;

use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Gate;

class RestaurantService
{
    public function getAllRestaurants(User $user = null, string $searchTerm = null, $lat = null, $lng = null): Collection
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
        
        $restaurants = $query->get();

        // Calculate distance if lat/lng provided
        if ($lat && $lng) {
            foreach ($restaurants as $restaurant) {
                if ($restaurant->latitude && $restaurant->longitude) {
                    $distance_km = $this->haversineDistance($lat, $lng, $restaurant->latitude, $restaurant->longitude);
                    $restaurant->distance_km = $distance_km;
                    $restaurant->distance_miles = $distance_km * 0.621371;
                } else {
                    $restaurant->distance_km = null;
                    $restaurant->distance_miles = null;
                }
            }
        }

        return $restaurants;
    }

    // Haversine formula in km
    private function haversineDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // km
        $lat1 = deg2rad($lat1);
        $lon1 = deg2rad($lon1);
        $lat2 = deg2rad($lat2);
        $lon2 = deg2rad($lon2);
        $dlat = $lat2 - $lat1;
        $dlon = $lon2 - $lon1;
        $a = sin($dlat/2) * sin($dlat/2) + cos($lat1) * cos($lat2) * sin($dlon/2) * sin($dlon/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        return $earthRadius * $c;
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