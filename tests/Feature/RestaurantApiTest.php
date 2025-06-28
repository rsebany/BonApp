<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RestaurantApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_restaurant_api_returns_restaurants_with_expected_fields()
    {
        $restaurant = Restaurant::factory()->create([
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/restaurants');
        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $restaurant->id,
                'restaurant_name' => $restaurant->restaurant_name,
            ]);
    }

    public function test_distance_km_is_calculated_if_lat_lng_provided()
    {
        $restaurant = Restaurant::factory()->create([
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'is_active' => true,
        ]);
        $lat = 40.730610;
        $lng = -73.935242;
        $response = $this->getJson("/api/restaurants?lat={$lat}&lng={$lng}");
        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $restaurant->id,
            ]);
        $data = $response->json('data')[0];
        $this->assertArrayHasKey('distance_km', $data);
        $this->assertIsNumeric($data['distance_km']);
    }

    public function test_favorites_only_filter()
    {
        $user = User::factory()->create();
        $restaurant = Restaurant::factory()->create(['is_active' => true]);
        $user->favoriteRestaurants()->attach($restaurant->id);
        $this->actingAs($user);
        $response = $this->getJson('/api/restaurants?favorites_only=1');
        $response->assertStatus(200)
            ->assertJsonFragment([
                'id' => $restaurant->id,
            ]);
    }
} 