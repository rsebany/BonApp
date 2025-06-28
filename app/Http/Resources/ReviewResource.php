<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            'restaurant_id' => $this->restaurant_id,
            'user_id' => $this->user_id,
            'user_name' => $this->user_name,
            'rating' => $this->rating,
            'formatted_rating' => $this->formatted_rating,
            'comment' => $this->comment,
            'is_verified' => $this->is_verified,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Include user data if requested
            'user' => $this->when($request->has('include_user'), function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->full_name,
                    'email' => $this->user->email,
                ];
            }),
            
            // Include restaurant data if requested
            'restaurant' => $this->when($request->has('include_restaurant'), function () {
                return [
                    'id' => $this->restaurant->id,
                    'name' => $this->restaurant->restaurant_name,
                ];
            }),
        ];
    }
}
