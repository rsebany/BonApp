<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'restaurant_name' => $this->restaurant_name,
            'address' => new AddressResource($this->whenLoaded('address')),
            'menu_items' => MenuItemResource::collection($this->whenLoaded('menuItems')),
            'orders_count' => $this->when(isset($this->orders_count), $this->orders_count),
            'average_rating' => $this->when(isset($this->average_rating), $this->average_rating),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}