<?php

namespace Database\Seeders;

use App\Models\Review;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $restaurants = Restaurant::all();
        $customers = User::where('role', 'customer')->get();

        if ($restaurants->isEmpty() || $customers->isEmpty()) {
            $this->command->warn('No restaurants or customers found. Skipping review seeding.');
            return;
        }

        // Create reviews for each restaurant
        foreach ($restaurants as $restaurant) {
            // Create 5-15 reviews per restaurant
            $reviewCount = rand(5, 15);
            
            for ($i = 0; $i < $reviewCount; $i++) {
                $customer = $customers->random();
                
                // Check if this customer already reviewed this restaurant
                $existingReview = Review::where('restaurant_id', $restaurant->id)
                    ->where('user_id', $customer->id)
                    ->exists();
                
                if (!$existingReview) {
                    Review::factory()->create([
                        'restaurant_id' => $restaurant->id,
                        'user_id' => $customer->id,
                    ]);
                }
            }
        }

        // Update restaurant ratings based on reviews
        $this->updateRestaurantRatings();
    }

    private function updateRestaurantRatings(): void
    {
        $restaurants = Restaurant::all();

        foreach ($restaurants as $restaurant) {
            $reviews = $restaurant->reviews;
            
            if ($reviews->count() > 0) {
                $avgRating = $reviews->avg('rating');
                $reviewCount = $reviews->count();
                
                $restaurant->update([
                    'rating' => round($avgRating, 1),
                    'review_count' => $reviewCount,
                ]);
            }
        }
    }
}
