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
            'customer_id' => $this->customer_id,
            'restaurant_id' => $this->restaurant_id,
            'customer_address_id' => $this->customer_address_id,
            'order_status_id' => $this->order_status_id,
            'assigned_driver_id' => $this->assigned_driver_id,
            'order_datetime' => $this->order_datetime?->format('Y-m-d H:i:s'),
            'requested_delivery_datetime' => $this->requested_delivery_datetime?->format('Y-m-d H:i:s'),
            'delivery_fee' => number_format((float) $this->delivery_fee, 2),
            'total_amount' => number_format((float) $this->total_amount, 2),
            'customer_driver_rating' => $this->customer_driver_rating,
            'customer_restaurant_rating' => $this->customer_restaurant_rating,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            
            // Relationships
            'customer' => $this->whenLoaded('customer', function () {
                return [
                    'id' => $this->customer->id,
                    'name' => $this->customer->first_name . ' ' . $this->customer->last_name,
                    'first_name' => $this->customer->first_name,
                    'last_name' => $this->customer->last_name,
                    'email' => $this->customer->email,
                    'phone' => $this->customer->phone ?? null,
                ];
            }),
            
            'restaurant' => $this->whenLoaded('restaurant', function () {
                return [
                    'id' => $this->restaurant->id,
                    'name' => $this->restaurant->restaurant_name,
                    'restaurant_name' => $this->restaurant->restaurant_name,
                    'phone' => $this->restaurant->phone ?? null,
                    'email' => $this->restaurant->email ?? null,
                    'address' => $this->whenLoaded('restaurant.address', function () {
                        return [
                            'id' => $this->restaurant->address->id,
                            'address_line1' => $this->restaurant->address->address_line1,
                            'address_line2' => $this->restaurant->address->address_line2,
                            'city' => $this->restaurant->address->city,
                            'region' => $this->restaurant->address->region,
                            'postal_code' => $this->restaurant->address->postal_code,
                            'country' => $this->whenLoaded('restaurant.address.country', function () {
                                return [
                                    'id' => $this->restaurant->address->country->id,
                                    'name' => $this->restaurant->address->country->country_name,
                                ];
                            }),
                        ];
                    }),
                ];
            }),
            
            'order_status' => $this->whenLoaded('orderStatus', function () {
                return [
                    'id' => $this->orderStatus->id,
                    'status' => $this->orderStatus->name ?? $this->orderStatus->name,
                    'name' => $this->orderStatus->name ?? $this->orderStatus->name,
                ];
            }),
            
            'assigned_driver' => $this->whenLoaded('assignedDriver', function () {
                return [
                    'id' => $this->assignedDriver->id,
                    'name' => $this->assignedDriver->first_name . ' ' . $this->assignedDriver->last_name,
                    'first_name' => $this->assignedDriver->first_name,
                    'last_name' => $this->assignedDriver->last_name,
                    'phone' => $this->assignedDriver->phone ?? null,
                ];
            }),
            
            'customer_address' => $this->whenLoaded('customerAddress', function () {
                return [
                    'id' => $this->customerAddress->id,
                    'address_line1' => $this->customerAddress->address_line1,
                    'address_line2' => $this->customerAddress->address_line2,
                    'city' => $this->customerAddress->city,
                    'region' => $this->customerAddress->region,
                    'postal_code' => $this->customerAddress->postal_code,
                    'country' => $this->whenLoaded('customerAddress.country', function () {
                        return [
                            'id' => $this->customerAddress->country->id,
                            'name' => $this->customerAddress->country->country_name,
                        ];
                    }),
                ];
            }),
            
            'order_items' => $this->whenLoaded('orderItems', function () {
                return $this->orderItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'quantity' => $item->qty_ordered,
                        'menu_item' => $this->when($item->relationLoaded('menuItem'), function () use ($item) {
                            return [
                                'id' => $item->menuItem->id,
                                'name' => $item->menuItem->item_name,
                                'price' => number_format((float) $item->menuItem->price, 2),
                            ];
                        }),
                    ];
                });
            }),
            
            // Computed fields
            'status' => $this->whenLoaded('orderStatus', function () {
                return $this->orderStatus->name ?? $this->orderStatus->name;
            }),
            
            'total' => (float) $this->total_amount,
            'delivery_fee_raw' => (float) $this->delivery_fee,
            'total_amount_raw' => (float) $this->total_amount,
            
            'formatted_total' => '$' . number_format((float) $this->total_amount, 2),
            'formatted_delivery_fee' => '$' . number_format((float) $this->delivery_fee, 2),
            'formatted_subtotal' => '$' . number_format((float) $this->total_amount - (float) $this->delivery_fee, 2),
            
            'order_date' => $this->created_at?->format('M d, Y'),
            'order_time' => $this->created_at?->format('h:i A'),
        ];
    }
}