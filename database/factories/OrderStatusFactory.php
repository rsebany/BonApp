<?php

namespace Database\Factories;

use App\Models\OrderStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderStatus>
 */
class OrderStatusFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = OrderStatus::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = [
            ['name' => 'Pending', 'color' => '#FFA500', 'description' => 'Order received and waiting for confirmation'],
            ['name' => 'Confirmed', 'color' => '#007BFF', 'description' => 'Order confirmed by restaurant'],
            ['name' => 'Preparing', 'color' => '#6C757D', 'description' => 'Order is being prepared'],
            ['name' => 'Ready', 'color' => '#17A2B8', 'description' => 'Order ready for pickup/delivery'],
            ['name' => 'Out for Delivery', 'color' => '#FFC107', 'description' => 'Order is out for delivery'],
            ['name' => 'Delivered', 'color' => '#28A745', 'description' => 'Order successfully delivered'],
            ['name' => 'Cancelled', 'color' => '#DC3545', 'description' => 'Order has been cancelled'],
        ];

        $status = $this->faker->randomElement($statuses);

        return [
            'name' => $status['name'],
            'color' => $status['color'],
            'sort_order' => $this->faker->numberBetween(1, 10),
            'is_default' => false,
            'description' => $status['description'],
        ];
    }

    /**
     * Indicate this is the default status.
     */
    public function default(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
            'name' => 'Pending',
            'color' => '#FFA500',
            'sort_order' => 1,
            'description' => 'Default status for new orders',
        ]);
    }

    /**
     * Create a pending status.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Pending',
            'color' => '#FFA500',
            'sort_order' => 1,
            'description' => 'Order received and waiting for confirmation',
        ]);
    }

    /**
     * Create a confirmed status.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Confirmed',
            'color' => '#007BFF',
            'sort_order' => 2,
            'description' => 'Order confirmed by restaurant',
        ]);
    }

    /**
     * Create a preparing status.
     */
    public function preparing(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Preparing',
            'color' => '#6C757D',
            'sort_order' => 3,
            'description' => 'Order is being prepared',
        ]);
    }

    /**
     * Create a ready status.
     */
    public function ready(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Ready',
            'color' => '#17A2B8',
            'sort_order' => 4,
            'description' => 'Order ready for pickup/delivery',
        ]);
    }

    /**
     * Create an out for delivery status.
     */
    public function outForDelivery(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Out for Delivery',
            'color' => '#FFC107',
            'sort_order' => 5,
            'description' => 'Order is out for delivery',
        ]);
    }

    /**
     * Create a delivered status.
     */
    public function delivered(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Delivered',
            'color' => '#28A745',
            'sort_order' => 6,
            'description' => 'Order successfully delivered',
        ]);
    }

    /**
     * Create a cancelled status.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Cancelled',
            'color' => '#DC3545',
            'sort_order' => 7,
            'description' => 'Order has been cancelled',
        ]);
    }
}
