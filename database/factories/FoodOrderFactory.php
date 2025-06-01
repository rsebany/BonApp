<?php

namespace Database\Factories;

use App\Models\FoodOrder;
use App\Models\User;
use App\Models\Restaurant;
use App\Models\Address;
use App\Models\OrderStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class FoodOrderFactory extends Factory
{
    protected $model = FoodOrder::class;

    public function definition(): array
    {
        $orderDateTime = $this->faker->dateTimeBetween('-1 month', 'now');
        $requestedDelivery = $this->faker->dateTimeBetween($orderDateTime, '+2 hours');

        return [
            'customer_id' => User::factory()->customer(),
            'restaurant_id' => Restaurant::factory(),
            'customer_address_id' => Address::factory(),
            'order_status_id' => OrderStatus::factory(),
            'assigned_driver_id' => $this->faker->optional(0.7)->passthrough(User::factory()->driver()),
            'order_datetime' => $orderDateTime,
            'delivery_fee' => $this->faker->randomFloat(2, 2, 8),
            'total_amount' => $this->faker->randomFloat(2, 10, 100),
            'requested_delivery_datetime' => $requestedDelivery,
            'customer_driver_rating' => $this->faker->optional(0.3)->numberBetween(1, 5),
            'customer_restaurant_rating' => $this->faker->optional(0.4)->numberBetween(1, 5),
        ];
    }
}
