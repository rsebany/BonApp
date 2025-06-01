<?php

namespace Database\Factories;

use App\Models\Restaurant;
use App\Models\Address;
use Illuminate\Database\Eloquent\Factories\Factory;

class RestaurantFactory extends Factory
{
    protected $model = Restaurant::class;

    public function definition(): array
    {
        return [
            'restaurant_name' => $this->faker->company() . ' Restaurant',
            'address_id' => Address::factory(),
        ];
    }
}