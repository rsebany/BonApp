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
            'rating' => $this->faker->randomFloat(1, 3.5, 5),
            'price_range' => $this->faker->randomElement(['$', '$$', '$$$']),
            'image' => $this->faker->imageUrl(640, 480, 'food', true),
            'tags' => $this->faker->randomElements(['Vegan', 'Family', 'Gourmet', 'Local', 'Organic', 'Fast', 'Healthy', 'Traditional', 'Fusion'], 3),
            'featured_dish' => $this->faker->words(2, true),
            'latitude' => $this->faker->latitude(),
            'longitude' => $this->faker->longitude(),
            'image_url' => $this->faker->imageUrl(640, 480, 'food', true),
            'special_offer' => $this->faker->optional()->randomElement(['10% off', 'Free delivery', '2 for 1', null]),
            'is_open' => $this->faker->boolean(80),
            'min_order' => $this->faker->randomFloat(2, 10, 30),
            'distance_km' => $this->faker->randomFloat(2, 0.5, 10),
            'review_count' => $this->faker->numberBetween(0, 500),
        ];
    }
}