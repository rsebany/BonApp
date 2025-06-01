<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use App\Models\Restaurant;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        $restaurants = Restaurant::all();

        $menuItemsData = [
            'Pizza Palace' => [
                ['Margherita Pizza', 15.99],
                ['Pepperoni Pizza', 18.99],
                ['Supreme Pizza', 22.99],
                ['Caesar Salad', 8.99],
                ['Garlic Bread', 5.99],
            ],
            'Burger Kingdom' => [
                ['Classic Burger', 12.99],
                ['Cheeseburger', 14.99],
                ['Bacon Burger', 16.99],
                ['Chicken Burger', 13.99],
                ['Fries', 4.99],
            ],
            'Sushi Master' => [
                ['California Roll', 8.99],
                ['Salmon Sashimi', 12.99],
                ['Tuna Roll', 10.99],
                ['Miso Soup', 3.99],
                ['Edamame', 4.99],
            ],
        ];

        foreach ($restaurants as $restaurant) {
            if (isset($menuItemsData[$restaurant->restaurant_name])) {
                foreach ($menuItemsData[$restaurant->restaurant_name] as $item) {
                    MenuItem::create([
                        'restaurant_id' => $restaurant->id,
                        'item_name' => $item[0],
                        'price' => $item[1],
                    ]);
                }
            } else {
                // Create random menu items for other restaurants
                MenuItem::factory()
                    ->count(rand(5, 10))
                    ->create(['restaurant_id' => $restaurant->id]);
            }
        }
    }
}