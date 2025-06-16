<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'restaurant_name' => $this->restaurant_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'description' => $this->description,
            'cuisine_type' => $this->cuisine_type,
            'opening_hours' => $this->opening_hours,
            'delivery_time' => $this->delivery_time,
            'minimum_order' => $this->minimum_order,
            'delivery_fee' => $this->delivery_fee,
            'image_path' => $this->image_path,
            'image_url' => $this->image_url,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            
            // Address relationship
            'address' => $this->whenLoaded('address', function () {
                return [
                    'id' => $this->address->id,
                    'unit_number' => $this->address->unit_number,
                    'street_number' => $this->address->street_number,
                    'address_line1' => $this->address->address_line1,
                    'address_line2' => $this->address->address_line2,
                    'city' => $this->address->city,
                    'region' => $this->address->region,
                    'postal_code' => $this->address->postal_code,
                    'country_id' => $this->address->country_id,
                    'full_address' => $this->address->full_address,
                    'short_address' => $this->address->short_address,
                    'country' => $this->whenLoaded('address.country', function () {
                        return [
                            'id' => $this->address->country->id,
                            'country_name' => $this->address->country->country_name,
                            'country_code' => $this->address->country->country_code,
                        ];
                    }),
                ];
            }),
            
            // Menu items relationship
            'menu_items' => $this->whenLoaded('menuItems', function () {
                return $this->menuItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'item_name' => $item->item_name,
                        'price' => $item->price,
                        'is_available' => $item->is_available,
                    ];
                });
            }),
            
            // Additional computed attributes
            'full_address' => $this->full_address,
        ];
    }
}