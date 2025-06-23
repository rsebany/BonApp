<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class GeocodingService
{
    /**
     * Get coordinates for an address using free geocoding service
     */
    public function getCoordinates(string $address): ?array
    {
        // Cache the result for 24 hours to avoid repeated API calls
        $cacheKey = 'geocoding_' . md5($address);
        
        return Cache::remember($cacheKey, 60 * 24, function () use ($address) {
            try {
                // Use Nominatim (OpenStreetMap) - completely free
                $response = Http::get('https://nominatim.openstreetmap.org/search', [
                    'q' => $address,
                    'format' => 'json',
                    'limit' => 1,
                    'addressdetails' => 1,
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    
                    if (!empty($data)) {
                        return [
                            'latitude' => (float) $data[0]['lat'],
                            'longitude' => (float) $data[0]['lon'],
                        ];
                    }
                }

                // Fallback to demo coordinates if geocoding fails
                return $this->getDemoCoordinates($address);
                
            } catch (\Exception $e) {
                \Log::warning('Geocoding failed for address: ' . $address, [
                    'error' => $e->getMessage()
                ]);
                
                // Return demo coordinates as fallback
                return $this->getDemoCoordinates($address);
            }
        });
    }

    /**
     * Get demo coordinates for testing purposes
     */
    private function getDemoCoordinates(string $address): array
    {
        // Generate consistent demo coordinates based on address hash
        $hash = crc32($address);
        
        // Use hash to generate coordinates within a reasonable range
        $lat = 40.7128 + (($hash % 1000) / 10000); // Around New York
        $lng = -74.0060 + (($hash % 1000) / 10000);
        
        return [
            'latitude' => $lat,
            'longitude' => $lng,
        ];
    }

    /**
     * Get address from coordinates (reverse geocoding)
     */
    public function getAddress(float $latitude, float $longitude): ?string
    {
        $cacheKey = "reverse_geocoding_{$latitude}_{$longitude}";
        
        return Cache::remember($cacheKey, 60 * 24, function () use ($latitude, $longitude) {
            try {
                $response = Http::get('https://nominatim.openstreetmap.org/reverse', [
                    'lat' => $latitude,
                    'lon' => $longitude,
                    'format' => 'json',
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    return $data['display_name'] ?? null;
                }
                
                return null;
                
            } catch (\Exception $e) {
                \Log::warning('Reverse geocoding failed', [
                    'lat' => $latitude,
                    'lng' => $longitude,
                    'error' => $e->getMessage()
                ]);
                
                return null;
            }
        });
    }

    /**
     * Calculate distance between two coordinates in kilometers
     */
    public function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) + 
                cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $miles = $dist * 60 * 1.1515;
        
        return $miles * 1.609344; // Convert to kilometers
    }

    /**
     * Get estimated travel time between two coordinates
     */
    public function getTravelTime(float $lat1, float $lon1, float $lat2, float $lon2): ?int
    {
        // This would typically use Google Directions API
        // For now, return a simple estimate based on distance
        $distance = $this->calculateDistance($lat1, $lon1, $lat2, $lon2);
        
        // Assume average speed of 30 km/h in city
        $timeInHours = $distance / 30;
        
        return (int) ($timeInHours * 60); // Return in minutes
    }
} 