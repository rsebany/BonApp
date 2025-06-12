<?php

namespace Database\Factories;

use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MenuItem>
 */
class MenuItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = MenuItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $foodItems = [
            // Appetizers
            'Buffalo Wings', 'Mozzarella Sticks', 'Loaded Nachos', 'Onion Rings', 'Caesar Salad',
            'Chicken Tenders', 'Potato Skins', 'Spinach Artichoke Dip', 'Jalapeño Poppers', 'Calamari Rings',
            
            // Main Courses
            'Cheeseburger', 'Chicken Sandwich', 'Fish and Chips', 'Grilled Salmon', 'Beef Steak',
            'Pasta Carbonara', 'Chicken Alfredo', 'Vegetable Stir Fry', 'BBQ Ribs', 'Fish Tacos',
            'Margherita Pizza', 'Pepperoni Pizza', 'Supreme Pizza', 'Chicken Caesar Wrap', 'Club Sandwich',
            
            // Desserts
            'Chocolate Cake', 'Cheesecake', 'Ice Cream Sundae', 'Apple Pie', 'Brownies',
            'Tiramisu', 'Crème Brûlée', 'Chocolate Mousse', 'Key Lime Pie', 'Banana Split',
            
            // Beverages
            'Coca Cola', 'Pepsi', 'Orange Juice', 'Iced Tea', 'Coffee', 'Lemonade',
            'Milkshake', 'Smoothie', 'Hot Chocolate', 'Green Tea'
        ];

        return [
            'restaurant_id' => $this->faker->numberBetween(1, 100),
            'item_name' => $this->faker->randomElement($foodItems),
            'price' => $this->faker->randomFloat(2, 5.99, 45.99),
        ];
    }

    /**
     * Indicate this is an appetizer.
     */
    public function appetizer(): static
    {
        $appetizers = [
            'Buffalo Wings', 'Mozzarella Sticks', 'Loaded Nachos', 'Onion Rings', 'Caesar Salad',
            'Chicken Tenders', 'Potato Skins', 'Spinach Artichoke Dip', 'Jalapeño Poppers', 'Calamari Rings'
        ];

        return $this->state(fn (array $attributes) => [
            'item_name' => $this->faker->randomElement($appetizers),
            'price' => $this->faker->randomFloat(2, 6.99, 14.99),
        ]);
    }

    /**
     * Indicate this is a main course.
     */
    public function mainCourse(): static
    {
        $mains = [
            'Cheeseburger', 'Chicken Sandwich', 'Fish and Chips', 'Grilled Salmon', 'Beef Steak',
            'Pasta Carbonara', 'Chicken Alfredo', 'Vegetable Stir Fry', 'BBQ Ribs', 'Fish Tacos',
            'Margherita Pizza', 'Pepperoni Pizza', 'Supreme Pizza', 'Chicken Caesar Wrap', 'Club Sandwich'
        ];

        return $this->state(fn (array $attributes) => [
            'item_name' => $this->faker->randomElement($mains),
            'price' => $this->faker->randomFloat(2, 12.99, 28.99),
        ]);
    }

    /**
     * Indicate this is a dessert.
     */
    public function dessert(): static
    {
        $desserts = [
            'Chocolate Cake', 'Cheesecake', 'Ice Cream Sundae', 'Apple Pie', 'Brownies',
            'Tiramisu', 'Crème Brûlée', 'Chocolate Mousse', 'Key Lime Pie', 'Banana Split'
        ];

        return $this->state(fn (array $attributes) => [
            'item_name' => $this->faker->randomElement($desserts),
            'price' => $this->faker->randomFloat(2, 4.99, 12.99),
        ]);
    }

    /**
     * Indicate this is a beverage.
     */
    public function beverage(): static
    {
        $beverages = [
            'Coca Cola', 'Pepsi', 'Orange Juice', 'Iced Tea', 'Coffee', 'Lemonade',
            'Milkshake', 'Smoothie', 'Hot Chocolate', 'Green Tea'
        ];

        return $this->state(fn (array $attributes) => [
            'item_name' => $this->faker->randomElement($beverages),
            'price' => $this->faker->randomFloat(2, 2.99, 8.99),
        ]);
    }

    /**
     * Indicate this is a premium item.
     */
    public function premium(): static
    {
        return $this->state(fn (array $attributes) => [
            'price' => $this->faker->randomFloat(2, 25.99, 65.99),
        ]);
    }

    /**
     * Indicate this is a budget item.
     */
    public function budget(): static
    {
        return $this->state(fn (array $attributes) => [
            'price' => $this->faker->randomFloat(2, 3.99, 9.99),
        ]);
    }

    /**
     * Pizza items specifically.
     */
    public function pizza(): static
    {
        $pizzas = [
            'Margherita Pizza', 'Pepperoni Pizza', 'Supreme Pizza', 'Hawaiian Pizza',
            'Meat Lovers Pizza', 'Veggie Pizza', 'BBQ Chicken Pizza', 'White Pizza'
        ];

        return $this->state(fn (array $attributes) => [
            'item_name' => $this->faker->randomElement($pizzas),
            'price' => $this->faker->randomFloat(2, 11.99, 22.99),
        ]);
    }
}