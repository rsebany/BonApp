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
            'opening_hours' => $this->faker->regexify('[08-11]:00-[20-23]:00'),
            'delivery_time' => $this->faker->numberBetween(20, 90),
            'delivery_fee' => $this->faker->randomFloat(2, 2, 8),
            'minimum_order' => $this->faker->randomFloat(2, 10, 30),
            'image_path' => null,
        ];
    }
}