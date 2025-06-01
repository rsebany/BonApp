<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->first_name . ' ' . $this->last_name,
            'email' => $this->when($this->shouldIncludeEmail($request), $this->email),
            'role' => $this->when($this->shouldIncludeRole($request), $this->role),
            'addresses' => AddressResource::collection($this->whenLoaded('addresses')),
            'orders' => OrderResource::collection($this->whenLoaded('orders')),
            'assigned_orders' => OrderResource::collection($this->whenLoaded('assignedOrders')),
            'email_verified_at' => $this->when($this->shouldIncludeEmail($request), $this->email_verified_at),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Determine if email should be included in response
     */
    private function shouldIncludeEmail(Request $request): bool
    {
        $user = $request->user();
        
        // Include email if user is viewing their own profile or if user is admin
        return $user && ($user->id === $this->id || $user->role === 'admin');
    }

    /**
     * Determine if role should be included in response
     */
    private function shouldIncludeRole(Request $request): bool
    {
        $user = $request->user();
        
        // Include role if user is viewing their own profile or if user is admin
        return $user && ($user->id === $this->id || $user->role === 'admin');
    }
}