<?php

namespace Database\Factories;

use App\Models\MenuItem;
use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Factories\Factory;

class MenuItemFactory extends Factory
{
    protected $model = MenuItem::class;

    public function definition(): array
    {
        $foodTypes = [
            'Pizza', 'Burger', 'Pasta', 'Salad', 'Sandwich', 'Soup', 'Steak', 
            'Chicken', 'Fish', 'Tacos', 'Sushi', 'Ramen', 'Curry', 'Dessert'
        ];

        return [
            'restaurant_id' => Restaurant::factory(),
            'item_name' => $this->faker->randomElement($foodTypes) . ' ' . $this->faker->word(),
            'price' => $this->faker->randomFloat(2, 5, 50),
        ];
    }
}