<?php

namespace Database\Factories;

use App\Models\OrderMenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderMenuItem>
 */
class OrderMenuItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = OrderMenuItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $menuItem = \App\Models\MenuItem::inRandomOrder()->first();
        return [
            'order_id' => \App\Models\FoodOrder::inRandomOrder()->first()?->id ?? 1,
            'menu_item_id' => $menuItem?->id ?? 1,
            'qty_ordered' => $this->faker->numberBetween(1, 5),
            'unit_price' => $menuItem?->price ?? 10.00,
        ];
    }

    /**
     * Indicate a single item order.
     */
    public function single(): static
    {
        return $this->state(fn (array $attributes) => [
            'qty_ordered' => 1,
        ]);
    }

    /**
     * Indicate a bulk order.
     */
    public function bulk(): static
    {
        return $this->state(fn (array $attributes) => [
            'qty_ordered' => $this->faker->numberBetween(6, 20),
        ]);
    }

    /**
     * Indicate a family-sized order.
     */
    public function familySize(): static
    {
        return $this->state(fn (array $attributes) => [
            'qty_ordered' => $this->faker->numberBetween(3, 8),
        ]);
    }
}