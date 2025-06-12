<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FoodOrder>
 */
class FoodOrderFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $orderDateTime = $this->faker->dateTimeBetween('-6 months', 'now');
        $requestedDeliveryDateTime = Carbon::parse($orderDateTime)->addMinutes(
            $this->faker->numberBetween(30, 120)
        );

        return [
            'customer_id' => $this->faker->numberBetween(1, 1000),
            'restaurant_id' => $this->faker->numberBetween(1, 100),
            'customer_address_id' => $this->faker->numberBetween(1, 2000),
            'order_status_id' => $this->faker->numberBetween(1, 6), // assuming 6 status types
            'assigned_driver_id' => $this->faker->optional(0.8)->numberBetween(1, 200),
            'order_datetime' => $orderDateTime,
            'delivery_fee' => $this->faker->randomFloat(2, 2.99, 9.99),
            'total_amount' => $this->faker->randomFloat(2, 15.00, 150.00),
            'requested_delivery_datetime' => $requestedDeliveryDateTime,
            'customer_driver_rating' => $this->faker->optional(0.6)->numberBetween(1, 5),
            'customer_restaurant_rating' => $this->faker->optional(0.7)->numberBetween(1, 5),
        ];
    }

    /**
     * Indicate that the order is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_status_id' => 1,
            'assigned_driver_id' => null,
            'customer_driver_rating' => null,
            'customer_restaurant_rating' => null,
        ]);
    }

    /**
     * Indicate that the order is confirmed.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_status_id' => 2,
            'assigned_driver_id' => $this->faker->numberBetween(1, 200),
            'customer_driver_rating' => null,
            'customer_restaurant_rating' => null,
        ]);
    }

    /**
     * Indicate that the order is being prepared.
     */
    public function preparing(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_status_id' => 3,
            'assigned_driver_id' => $this->faker->numberBetween(1, 200),
            'customer_driver_rating' => null,
            'customer_restaurant_rating' => null,
        ]);
    }

    /**
     * Indicate that the order is out for delivery.
     */
    public function outForDelivery(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_status_id' => 4,
            'assigned_driver_id' => $this->faker->numberBetween(1, 200),
            'customer_driver_rating' => null,
            'customer_restaurant_rating' => null,
        ]);
    }

    /**
     * Indicate that the order is delivered.
     */
    public function delivered(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_status_id' => 5,
            'assigned_driver_id' => $this->faker->numberBetween(1, 200),
            'customer_driver_rating' => $this->faker->numberBetween(1, 5),
            'customer_restaurant_rating' => $this->faker->numberBetween(1, 5),
        ]);
    }

    /**
     * Indicate that the order is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_status_id' => 6,
            'assigned_driver_id' => $this->faker->optional(0.3)->numberBetween(1, 200),
            'customer_driver_rating' => null,
            'customer_restaurant_rating' => null,
        ]);
    }

    /**
     * Indicate that the order has high ratings.
     */
    public function highRating(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_status_id' => 5, // delivered
            'customer_driver_rating' => $this->faker->numberBetween(4, 5),
            'customer_restaurant_rating' => $this->faker->numberBetween(4, 5),
        ]);
    }

    /**
     * Indicate that the order has low ratings.
     */
    public function lowRating(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_status_id' => 5, // delivered
            'customer_driver_rating' => $this->faker->numberBetween(1, 2),
            'customer_restaurant_rating' => $this->faker->numberBetween(1, 2),
        ]);
    }

    /**
     * Indicate that the order is a large order.
     */
    public function largeOrder(): static
    {
        return $this->state(fn (array $attributes) => [
            'total_amount' => $this->faker->randomFloat(2, 80.00, 250.00),
            'delivery_fee' => $this->faker->randomFloat(2, 5.99, 12.99),
        ]);
    }

    /**
     * Indicate that the order is a recent order.
     */
    public function recent(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_datetime' => $this->faker->dateTimeBetween('-7 days', 'now'),
        ]);
    }
}