<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\User;
use App\Models\Country;
use Illuminate\Database\Seeder;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();
        $countries = Country::all();

        foreach ($customers as $customer) {
            // Create 1-3 addresses per customer
            Address::factory()
                ->count(rand(1, 3))
                ->create([
                    'customer_id' => $customer->id,
                    'country_id' => $countries->random()->id,
                ]);
        }

        // Create addresses for restaurants (will be used in RestaurantSeeder)
        Address::factory()
            ->count(15)
            ->create([
                'customer_id' => null, // Restaurant addresses don't have customer_id
                'country_id' => $countries->random()->id,
            ]);
    }
}