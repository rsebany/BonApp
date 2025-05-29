<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;
use App\Models\Address;
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\Restaurant;
use App\Models\MenuItem;
use App\Models\Driver;
use App\Models\FoodOrder;
use App\Models\OrderMenuItem;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Romu',
            'email' => 'romu@bonapp.com',
            'password' => bcrypt('password'),
            'email_verified_at' => time()
        ]);

        // Seed countries first
        $countries = [
            ['country_name' => 'United States'],
            ['country_name' => 'Canada'],
            ['country_name' => 'United Kingdom'],
            ['country_name' => 'Australia'],
        ];
        
        foreach ($countries as $country) {
            Country::create($country);
        }

        // Create 10 customers with addresses
        $customers = Customer::factory(10)->create();
        
        foreach ($customers as $customer) {
            $address = Address::factory()->create([
                'country_id' => rand(1, 4)
            ]);
            
            // Create customer address with both customer_id and address_id
            CustomerAddress::create([
                'customer_id' => $customer->id,
                'address_id' => $address->id,
            ]);
        }

        // Create 5 restaurants with addresses
        $restaurants = Restaurant::factory(5)->create();
        
        foreach ($restaurants as $restaurant) {
            $address = Address::factory()->create([
                'country_id' => rand(1, 4)
            ]);
            
            $restaurant->address_id = $address->id;
            $restaurant->save();
        }

        // Create menu items for each restaurant
        foreach ($restaurants as $restaurant) {
            MenuItem::factory(rand(5, 15))->create([
                'restaurant_id' => $restaurant->id,
            ]);
        }

        // Create 5 drivers
        $drivers = Driver::factory(5)->create();

        // Create 20 orders with proper relationships
        $orders = FoodOrder::factory(20)->create([
            'customer_id' => fn() => Customer::inRandomOrder()->first()->id,
            'restaurant_id' => fn() => Restaurant::inRandomOrder()->first()->id,
            'customer_address_id' => fn() => CustomerAddress::inRandomOrder()->first()->id,
        ]);
        
        foreach ($orders as $order) {
            // Get random menu items from the ordered restaurant
            $menuItems = MenuItem::where('restaurant_id', $order->restaurant_id)
                                ->inRandomOrder()
                                ->limit(rand(1, 5))
                                ->get();
            
            $totalAmount = 0;
            
            foreach ($menuItems as $item) {
                $qty = rand(1, 3);
                $totalAmount += $item->price * $qty;
                
                OrderMenuItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item->id,
                    'qty_ordered' => $qty,
                ]);
            }
            
            // Add delivery fee and update total
            $order->total_amount = $totalAmount + $order->delivery_fee;
            $order->save();
            
            // Randomly assign ratings for some orders
            if (rand(0, 1)) {
                $order->cust_driver_rating = rand(3, 5);
                $order->cust_restaurant_rating = rand(3, 5);
                $order->save();
            }
        }
    }
}