<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Resources\RestaurantResource;

class RestaurantController extends Controller
{
    // API method for getting restaurants (used by AJAX calls)
    public function getRestaurants(Request $request)
    {
        $query = Restaurant::query()->where('is_active', true);

        // Filter by category (cuisine_type)
        if ($request->has('category') && $request->category !== 'All') {
            $query->where('cuisine_type', $request->category);
        }

        // Filter by price range
        if ($request->has('price_range') && $request->price_range !== 'All') {
            $query->where('price_range', $request->price_range);
        }

        // Filter by open now
        if ($request->has('open_now') && $request->open_now) {
            $query->where('is_open', true);
        }

        // Filter by tags (array or single)
        if ($request->has('tags') && $request->tags) {
            $tags = is_array($request->tags) ? $request->tags : [$request->tags];
            foreach ($tags as $tag) {
                $query->whereJsonContains('tags', $tag);
            }
        }

        // Filter by favorites only
        if ($request->has('favorites_only') && $request->favorites_only && Auth::check()) {
            $query->whereIn('id', Auth::user()->favoriteRestaurants()->pluck('restaurant_id'));
        }

        // Search by name
        if ($request->has('search') && $request->search) {
            $query->where('restaurant_name', 'like', '%' . $request->search . '%');
        }

        // Sorting
        if ($request->has('sort')) {
            $sort = $request->get('sort');
            if (in_array($sort, ['rating', 'delivery_time', 'distance_km', 'price_range'])) {
                $query->orderBy($sort, 'desc');
            }
        }

        $lat = $request->input('lat');
        $lng = $request->input('lng');
        $restaurants = $query->paginate(8);
        $restaurants->getCollection()->transform(function ($restaurant) use ($lat, $lng) {
            $restaurant->is_favorite = Auth::check() && Auth::user()->favoriteRestaurants()->where('restaurant_id', $restaurant->id)->exists();
            if ($lat && $lng && $restaurant->latitude && $restaurant->longitude) {
                $restaurant->distance_km = $this->haversineDistance($lat, $lng, $restaurant->latitude, $restaurant->longitude);
            }
            return $restaurant;
        });
        return RestaurantResource::collection($restaurants);
    }

    // Haversine formula in km
    private function haversineDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // km
        $lat1 = deg2rad($lat1);
        $lon1 = deg2rad($lon1);
        $lat2 = deg2rad($lat2);
        $lon2 = deg2rad($lon2);
        $dlat = $lat2 - $lat1;
        $dlon = $lon2 - $lon1;
        $a = sin($dlat/2) * sin($dlat/2) + cos($lat1) * cos($lat2) * sin($dlon/2) * sin($dlon/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        return $earthRadius * $c;
    }

    // List restaurants with optional filters
    public function index(Request $request)
    {
        $query = Restaurant::with('address');

        // Filter by category (cuisine_type)
        if ($request->has('category') && $request->category !== 'All') {
            $query->where('cuisine_type', $request->category);
        }

        // Filter by price range
        if ($request->has('price_range') && $request->price_range !== 'All') {
            $query->where('price_range', $request->price_range);
        }

        // Filter by open now
        if ($request->has('open_now') && $request->open_now) {
            $query->where('is_open', true);
        }

        // Filter by tags (array or single)
        if ($request->has('tags') && $request->tags) {
            $tags = is_array($request->tags) ? $request->tags : [$request->tags];
            foreach ($tags as $tag) {
                $query->whereJsonContains('tags', $tag);
            }
        }

        // Filter by favorites only
        if ($request->has('favorites_only') && $request->favorites_only && Auth::check()) {
            $query->whereIn('id', Auth::user()->favoriteRestaurants()->pluck('restaurant_id'));
        }

        // Trending: e.g., by review_count or a 'trending' tag
        if ($request->has('trending') && $request->trending) {
            $query->whereJsonContains('tags', 'Trending');
        }

        // Featured: e.g., by rating
        if ($request->has('featured') && $request->featured) {
            $query->where('rating', '>=', 4.7);
        }

        // Search by name
        if ($request->has('search') && $request->search) {
            $query->where('restaurant_name', 'like', '%' . $request->search . '%');
        }

        // Sorting
        if ($request->has('sort')) {
            $sort = $request->get('sort');
            if (in_array($sort, ['rating', 'delivery_time', 'distance_km', 'price_range', 'review_count'])) {
                $query->orderBy($sort, 'desc');
            }
        }

        $restaurants = $query->paginate(12)->through(function ($restaurant) {
            $restaurant->is_favorite = Auth::check() && Auth::user()->favoriteRestaurants()->where('restaurant_id', $restaurant->id)->exists();
            return $restaurant;
        });

        // Get all available tags and price ranges for filter UI
        $allTags = Restaurant::select('tags')->get()->pluck('tags')->flatten()->unique()->values();
        $allPriceRanges = Restaurant::select('price_range')->distinct()->pluck('price_range')->filter()->values();

        return Inertia::render('User/Restaurants/index', [
            'restaurants' => $restaurants,
            'filters' => [
                'category' => $request->get('category', 'All'),
                'search' => $request->get('search', ''),
                'sort' => $request->get('sort', ''),
                'price_range' => $request->get('price_range', 'All'),
                'open_now' => $request->get('open_now', false),
                'tags' => $request->get('tags', []),
                'favorites_only' => $request->get('favorites_only', false),
                'trending' => $request->get('trending', false),
                'featured' => $request->get('featured', false),
            ],
            'allTags' => $allTags,
            'allPriceRanges' => $allPriceRanges,
        ]);
    }

    // Show a single restaurant's details
    public function show($id)
    {
        $restaurant = Restaurant::with(['menuItems', 'reviews'])->findOrFail($id);
        $restaurant->is_favorite = Auth::check() && Auth::user()->favoriteRestaurants()->where('restaurant_id', $restaurant->id)->exists();
        return Inertia::render('User/Restaurants/show', [
            'restaurant' => $restaurant,
        ]);
    }

    // Toggle favorite status
    public function toggleFavorite($id)
    {
        $user = Auth::user();
        $restaurant = Restaurant::findOrFail($id);

        if ($user->favoriteRestaurants()->where('restaurant_id', $id)->exists()) {
            $user->favoriteRestaurants()->detach($id);
            $is_favorite = false;
        } else {
            $user->favoriteRestaurants()->attach($id);
            $is_favorite = true;
        }

        return response()->json(['is_favorite' => $is_favorite]);
    }

    // Show user's favorite restaurants
    public function favorites(Request $request)
    {
        $user = Auth::user();
        
        $query = $user->favoriteRestaurants()->with('address');

        // Apply filters if provided
        if ($request->has('category') && $request->category !== 'All') {
            $query->where('cuisine_type', $request->category);
        }

        if ($request->has('price_range') && $request->price_range !== 'All') {
            $query->where('price_range', $request->price_range);
        }

        if ($request->has('search') && $request->search) {
            $query->where('restaurant_name', 'like', '%' . $request->search . '%');
        }

        // Sorting
        if ($request->has('sort')) {
            $sort = $request->get('sort');
            if (in_array($sort, ['rating', 'delivery_time', 'distance_km', 'price_range', 'review_count'])) {
                $query->orderBy($sort, 'desc');
            }
        }

        $restaurants = $query->paginate(12)->through(function ($restaurant) {
            $restaurant->is_favorite = true; // All restaurants on this page are favorites
            return $restaurant;
        });

        // Get all available tags and price ranges for filter UI
        $allTags = Restaurant::select('tags')->get()->pluck('tags')->flatten()->unique()->values();
        $allPriceRanges = Restaurant::select('price_range')->distinct()->pluck('price_range')->filter()->values();

        return Inertia::render('User/Restaurants/favorites', [
            'restaurants' => $restaurants,
            'filters' => [
                'category' => $request->get('category', 'All'),
                'search' => $request->get('search', ''),
                'sort' => $request->get('sort', ''),
                'price_range' => $request->get('price_range', 'All'),
            ],
            'allTags' => $allTags,
            'allPriceRanges' => $allPriceRanges,
        ]);
    }
}
