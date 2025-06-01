<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'customer' => new UserResource($this->whenLoaded('customer')),
            'restaurant' => new RestaurantResource($this->whenLoaded('restaurant')),
            'customer_address' => new AddressResource($this->whenLoaded('customerAddress')),
            'order_status' => [
                'id' => $this->orderStatus->id,
                'status_value' => $this->orderStatus->status_value,
            ],
            'assigned_driver' => new UserResource($this->whenLoaded('assignedDriver')),
            'order_datetime' => $this->order_datetime,
            'delivery_fee' => $this->delivery_fee,
            'total_amount' => $this->total_amount,
            'requested_delivery_datetime' => $this->requested_delivery_datetime,
            'customer_driver_rating' => $this->customer_driver_rating,
            'customer_restaurant_rating' => $this->customer_restaurant_rating,
            'order_items' => OrderMenuResource::collection($this->whenLoaded('orderItems')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}