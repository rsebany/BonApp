<?php

namespace Database\Seeders;

use App\Models\FoodOrder;
use App\Models\User;
use App\Models\Restaurant;
use App\Models\Address;
use App\Models\OrderStatus;
use Illuminate\Database\Seeder;

class FoodOrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();
        $drivers = User::where('role', 'driver')->get();
        $restaurants = Restaurant::all();
        $orderStatuses = OrderStatus::all();

        foreach ($customers as $customer) {
            $customerAddresses = Address::where('customer_id', $customer->id)->get();
            
            if ($customerAddresses->count() > 0) {
                // Create 1-5 orders per customer
                for ($i = 0; $i < rand(1, 5); $i++) {
                    FoodOrder::create([
                        'customer_id' => $customer->id,
                        'restaurant_id' => $restaurants->random()->id,
                        'customer_address_id' => $customerAddresses->random()->id,
                        'order_status_id' => $orderStatuses->random()->id,
                        'assigned_driver_id' => rand(0, 1) ? $drivers->random()->id : null,
                        'order_datetime' => now()->subDays(rand(0, 30))->subHours(rand(0, 23)),
                        'delivery_fee' => rand(200, 800) / 100, // $2.00 to $8.00
                        'total_amount' => rand(1000, 8000) / 100, // $10.00 to $80.00
                        'requested_delivery_datetime' => now()->addHours(rand(1, 3)),
                        'customer_driver_rating' => rand(0, 1) ? rand(1, 5) : null,
                        'customer_restaurant_rating' => rand(0, 1) ? rand(1, 5) : null,
                    ]);
                }
            }
        }
    }
}