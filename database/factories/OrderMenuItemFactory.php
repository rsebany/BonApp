<?php

namespace Database\Factories;

use App\Models\OrderMenuItem;
use App\Models\FoodOrder;
use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderMenuItemFactory extends Factory
{
    protected $model = OrderMenuItem::class;

    public function definition(): array
    {
        return [
            'order_id' => FoodOrder::factory(),
            'menu_item_id' => MenuItem::factory(),
            'qty_ordered' => $this->faker->numberBetween(1, 5),
        ];
    }
}