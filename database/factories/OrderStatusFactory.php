<?php
namespace Database\Factories;

use App\Models\OrderStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderStatusFactory extends Factory
{
    protected $model = OrderStatus::class;

    public function definition(): array
    {
        $statuses = [
            ['name' => 'Pending', 'color' => 'yellow', 'sort_order' => 1],
            ['name' => 'Processing', 'color' => 'blue', 'sort_order' => 2],
            ['name' => 'Shipped', 'color' => 'purple', 'sort_order' => 3],
            ['name' => 'Out for Delivery', 'color' => 'orange', 'sort_order' => 4],
            ['name' => 'Delivered', 'color' => 'green', 'sort_order' => 5],
            ['name' => 'Cancelled', 'color' => 'red', 'sort_order' => 6],
        ];

        $status = $this->faker->randomElement($statuses);

        return [
            'name' => $status['name'],
            'color' => $status['color'],
            'sort_order' => $status['sort_order'],
            'is_default' => false,
            'description' => $this->faker->optional()->sentence(),
        ];
    }

    public function default(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }
}