<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CountrySeeder::class,
            UserSeeder::class,
            AddressSeeder::class,
            RestaurantSeeder::class,
            MenuItemSeeder::class,
            OrderStatusSeeder::class,
            CustomerAddressSeeder::class,
            FoodOrderSeeder::class,
            OrderMenuItemSeeder::class,
            DriverSeeder::class,
            OrderStatusHistorySeeder::class,
            OrderTrackingUpdateSeeder::class,
            ReviewSeeder::class,
        ]);
    }
}