<?php

namespace Database\Seeders;

use App\Models\OrderMenuItem;
use App\Models\FoodOrder;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class OrderMenuItemSeeder extends Seeder
{
    public function run(): void
    {
        $orders = FoodOrder::all();

        foreach ($orders as $order) {
            $restaurantMenuItems = MenuItem::where('restaurant_id', $order->restaurant_id)->get();
            
            if ($restaurantMenuItems->count() > 0) {
                // Add 1-4 different menu items to each order
                $itemCount = rand(1, min(4, $restaurantMenuItems->count()));
                $selectedItems = $restaurantMenuItems->random($itemCount);
                
                foreach ($selectedItems as $menuItem) {
                    OrderMenuItem::create([
                        'order_id' => $order->id,
                        'menu_item_id' => $menuItem->id,
                        'qty_ordered' => rand(1, 3),
                    ]);
                }
            }
        }
    }
}