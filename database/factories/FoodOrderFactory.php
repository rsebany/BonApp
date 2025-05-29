<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FoodOrder>
 */
class FoodOrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => \App\Models\Customer::factory(),
            'restaurant_id' => \App\Models\Restaurant::factory(),
            'customer_address_id' => function (array $attributes) {
                return \App\Models\CustomerAddress::factory()
                    ->create(['customer_id' => $attributes['customer_id']]);
            },
            'order_status_id' => \App\Models\OrderStatus::inRandomOrder()->first()->id,
            'assigned_driver_id' => \App\Models\Driver::factory(),
            'order_date_time' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'delivery_fee' => $this->faker->randomFloat(2, 2, 10),
            'total_amount' => $this->faker->randomFloat(2, 15, 100),
            'requested_delivery_date_time' => $this->faker->dateTimeBetween('now', '+1 week'),
            'cust_driver_rating' => $this->faker->optional()->numberBetween(1, 5),
            'cust_restaurant_rating' => $this->faker->optional()->numberBetween(1, 5),
        ];
    }
}
