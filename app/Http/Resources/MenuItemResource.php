<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'restaurant_id' => $this->restaurant_id,
            'restaurant' => new RestaurantResource($this->whenLoaded('restaurant')),
            'item_name' => $this->item_name,
            'price' => $this->price,
            'formatted_price' => number_format($this->price, 2),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}