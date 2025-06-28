<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Review::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'restaurant_id' => Restaurant::inRandomOrder()->first()?->id ?? 1,
            'user_id' => User::where('role', 'customer')->inRandomOrder()->first()?->id ?? 1,
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->optional(0.8)->paragraph(),
            'is_verified' => $this->faker->boolean(80), // 80% chance of being verified
        ];
    }

    /**
     * Indicate that the review is high rating (4-5 stars).
     */
    public function highRating(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => $this->faker->numberBetween(4, 5),
        ]);
    }

    /**
     * Indicate that the review is low rating (1-2 stars).
     */
    public function lowRating(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => $this->faker->numberBetween(1, 2),
        ]);
    }

    /**
     * Indicate that the review is verified.
     */
    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => true,
        ]);
    }

    /**
     * Indicate that the review has a comment.
     */
    public function withComment(): static
    {
        return $this->state(fn (array $attributes) => [
            'comment' => $this->faker->paragraph(),
        ]);
    }

    /**
     * Indicate that the review is recent (within last 30 days).
     */
    public function recent(): static
    {
        return $this->state(fn (array $attributes) => [
            'created_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ]);
    }
}
