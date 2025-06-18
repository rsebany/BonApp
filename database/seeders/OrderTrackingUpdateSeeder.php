<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrderTrackingUpdate;
use App\Models\FoodOrder;
use App\Models\User;

class OrderTrackingUpdateSeeder extends Seeder
{
    public function run(): void
    {
        $orders = FoodOrder::pluck('id');
        $drivers = User::where('role', 'driver')->pluck('id');
        foreach (range(1, 100) as $i) {
            OrderTrackingUpdate::create([
                'order_id' => $orders->random(),
                'driver_id' => $drivers->random(),
                'latitude' => fake()->latitude,
                'longitude' => fake()->longitude,
                'status' => 'On the way',
                'description' => 'Driver is en route',
            ]);
        }
    }
} 