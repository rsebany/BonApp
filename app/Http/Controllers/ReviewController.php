<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews for a restaurant.
     */
    public function index(Request $request, $restaurantId)
    {
        $restaurant = Restaurant::findOrFail($restaurantId);
        
        $reviews = $restaurant->reviews()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return ReviewResource::collection($reviews);
    }

    /**
     * Store a newly created review.
     */
    public function store(Request $request, $restaurantId)
    {
        $restaurant = Restaurant::findOrFail($restaurantId);
        
        // Check if user already reviewed this restaurant
        $existingReview = Review::where('restaurant_id', $restaurantId)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingReview) {
            throw ValidationException::withMessages([
                'restaurant' => 'You have already reviewed this restaurant.'
            ]);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review = Review::create([
            'restaurant_id' => $restaurantId,
            'user_id' => Auth::id(),
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'is_verified' => false, // Default to false, admin can verify later
        ]);

        // Update restaurant rating
        $this->updateRestaurantRating($restaurant);

        return new ReviewResource($review->load('user'));
    }

    /**
     * Display the specified review.
     */
    public function show($restaurantId, $reviewId)
    {
        $review = Review::where('restaurant_id', $restaurantId)
            ->with('user')
            ->findOrFail($reviewId);

        return new ReviewResource($review);
    }

    /**
     * Update the specified review.
     */
    public function update(Request $request, $restaurantId, $reviewId)
    {
        $review = Review::where('restaurant_id', $restaurantId)
            ->findOrFail($reviewId);

        // Check if user owns the review or is admin
        if ($review->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'rating' => 'sometimes|integer|between:1,5',
            'comment' => 'sometimes|nullable|string|max:1000',
        ]);

        $review->update($validated);

        // Update restaurant rating if rating changed
        if (isset($validated['rating'])) {
            $this->updateRestaurantRating($review->restaurant);
        }

        return new ReviewResource($review->load('user'));
    }

    /**
     * Remove the specified review.
     */
    public function destroy($restaurantId, $reviewId)
    {
        $review = Review::where('restaurant_id', $restaurantId)
            ->findOrFail($reviewId);

        // Check if user owns the review or is admin
        if ($review->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $restaurant = $review->restaurant;
        $review->delete();

        // Update restaurant rating
        $this->updateRestaurantRating($restaurant);

        return response()->json(['message' => 'Review deleted successfully']);
    }

    /**
     * Toggle verification status of a review (admin only).
     */
    public function toggleVerification($restaurantId, $reviewId)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $review = Review::where('restaurant_id', $restaurantId)
            ->findOrFail($reviewId);

        $review->update(['is_verified' => !$review->is_verified]);

        return new ReviewResource($review->load('user'));
    }

    /**
     * Update restaurant rating based on reviews.
     */
    private function updateRestaurantRating(Restaurant $restaurant): void
    {
        $reviews = $restaurant->reviews;
        
        if ($reviews->count() > 0) {
            $avgRating = $reviews->avg('rating');
            $reviewCount = $reviews->count();
            
            $restaurant->update([
                'rating' => round($avgRating, 1),
                'review_count' => $reviewCount,
            ]);
        } else {
            $restaurant->update([
                'rating' => 0,
                'review_count' => 0,
            ]);
        }
    }
}
