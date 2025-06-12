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
        $cuisines = [
            'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai',
            'American', 'French', 'Mediterranean', 'Korean', 'Vietnamese'
        ];

        $restaurantTypes = [
            'Restaurant', 'Bistro', 'Café', 'Eatery', 'Grill', 'Kitchen',
            'Diner', 'Pizzeria', 'Sushi Bar', 'Steakhouse'
        ];

        return [
            'restaurant_name' => $this->faker->company() . ' ' . $this->faker->randomElement($restaurantTypes),
            'cuisine_type' => $this->faker->randomElement($cuisines),
            'description' => $this->faker->paragraph(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->companyEmail(),
            'address_id' => Address::factory(),
            'is_active' => true,
            'opening_time' => $this->faker->time('H:i:s'),
            'closing_time' => $this->faker->time('H:i:s'),
            'delivery_fee' => $this->faker->randomFloat(2, 2, 8),
            'minimum_order' => $this->faker->randomFloat(2, 10, 30),
            'average_rating' => $this->faker->randomFloat(1, 3, 5),
            'total_ratings' => $this->faker->numberBetween(10, 1000),
        ];
    }
}