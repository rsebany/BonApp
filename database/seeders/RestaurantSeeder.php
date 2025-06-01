<?php

namespace Database\Seeders;

use App\Models\Restaurant;
use App\Models\Address;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    public function run(): void
    {
        $restaurantNames = [
            'Pizza Palace',
            'Burger Kingdom',
            'Sushi Master',
            'Pasta Corner',
            'Taco Fiesta',
            'BBQ Heaven',
            'Healthy Greens',
            'Spice Route',
            'Ocean Breeze Seafood',
            'Mountain View Grill',
        ];

        // Get addresses that aren't assigned to customers (for restaurants)
        $availableAddresses = Address::whereNull('customer_id')->get();

        foreach ($restaurantNames as $index => $name) {
            if ($availableAddresses->count() > $index) {
                Restaurant::create([
                    'restaurant_name' => $name,
                    'address_id' => $availableAddresses[$index]->id,
                ]);
            }
        }
    }
}