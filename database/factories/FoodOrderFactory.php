<?php

namespace Database\Factories;

use App\Models\FoodOrder;
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
    protected $model = FoodOrder::class;

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
            'customer_id' => \App\Models\User::where('role', 'customer')->inRandomOrder()->first()?->id ?? 1,
            'restaurant_id' => \App\Models\Restaurant::inRandomOrder()->first()?->id ?? 1,
            'customer_address_id' => \App\Models\CustomerAddress::inRandomOrder()->first()?->id ?? 1,
            'order_status_id' => \App\Models\OrderStatus::inRandomOrder()->first()?->id ?? 1,
            'assigned_driver_id' => \App\Models\Driver::inRandomOrder()->first()?->id,
            'order_date_time' => $orderDateTime,
            'delivery_fee' => $this->faker->randomFloat(2, 2.99, 9.99),
            'total_amount' => $this->faker->randomFloat(2, 15.00, 150.00),
            'requested_delivery_date_time' => $requestedDeliveryDateTime,
            'cust_driver_rating' => $this->faker->optional(0.6)->numberBetween(1, 5),
            'cust_restaurant_rating' => $this->faker->optional(0.7)->numberBetween(1, 5),
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
            'cust_driver_rating' => null,
            'cust_restaurant_rating' => null,
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
            'cust_driver_rating' => null,
            'cust_restaurant_rating' => null,
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
            'cust_driver_rating' => null,
            'cust_restaurant_rating' => null,
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
            'cust_driver_rating' => null,
            'cust_restaurant_rating' => null,
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
            'cust_driver_rating' => $this->faker->numberBetween(1, 5),
            'cust_restaurant_rating' => $this->faker->numberBetween(1, 5),
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
            'cust_driver_rating' => null,
            'cust_restaurant_rating' => null,
        ]);
    }

    /**
     * Indicate that the order has high ratings.
     */
    public function highRating(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_status_id' => 5, // delivered
            'cust_driver_rating' => $this->faker->numberBetween(4, 5),
            'cust_restaurant_rating' => $this->faker->numberBetween(4, 5),
        ]);
    }

    /**
     * Indicate that the order has low ratings.
     */
    public function lowRating(): static
    {
        return $this->state(fn (array $attributes) => [
            'order_status_id' => 5, // delivered
            'cust_driver_rating' => $this->faker->numberBetween(1, 2),
            'cust_restaurant_rating' => $this->faker->numberBetween(1, 2),
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
            'order_date_time' => $this->faker->dateTimeBetween('-7 days', 'now'),
        ]);
    }
}