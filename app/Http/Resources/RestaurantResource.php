<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\User;

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
            'email' => $this->when($this->shouldIncludeEmail($request), $this->email),
            'phone' => $this->phone,
            'description' => $this->description,
            'cuisine_type' => $this->cuisine_type,
            'opening_hours' => $this->opening_hours,
            'delivery_time' => $this->delivery_time,
            'minimum_order' => $this->minimum_order,
            'delivery_fee' => $this->delivery_fee,
            'is_active' => $this->when($this->shouldIncludeAdminFields($request), $this->is_active),
            'status' => $this->getStatusLabel(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Conditional relationships
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
                    'country_name' => $this->address->country->country_name ?? null,
                ];
            }),
            
            'owner' => $this->whenLoaded('user', function () use ($request) {
                return $this->user ? [
                    'id' => $this->user->id,
                    'name' => $this->user->full_name,
                    'email' => $this->when($this->shouldIncludeOwnerEmail($request), $this->user->email),
                ] : null;
            }),
            
            // Counts with conditional display
            'menu_items_count' => $this->whenCounted('menuItems'),
            'active_menu_items_count' => $this->when($this->shouldIncludeAdminFields($request), 
                $this->menuItems()->where('is_available', true)->count()),
            'orders_count' => $this->whenCounted('orders'),
            
            // Additional user-specific data
            'is_owner' => $this->isOwnedBy($request->user()),
            'can_edit' => $this->canBeEditedBy($request->user()),
        ];
    }

    /**
     * Determine if email should be included in response
     */
    private function shouldIncludeEmail(Request $request): bool
    {
        $user = $request->user();
        return $user && ($this->isOwnedBy($user) || $user->isAdmin());
    }

    /**
     * Determine if owner email should be included
     */
    private function shouldIncludeOwnerEmail(Request $request): bool
    {
        $user = $request->user();
        return $user && ($user->isAdmin() || $user->id === $this->user_id);
    }

    /**
     * Determine if admin-only fields should be included
     */
    private function shouldIncludeAdminFields(Request $request): bool
    {
        return $request->user()?->isAdmin() ?? false;
    }
    /**
     * Check if restaurant is owned by user
     */
    private function isOwnedBy(?User $user): bool
    {
        return $user && $user->id === $this->user_id;
    }

    /**
     * Check if user can edit this restaurant
     */
    private function canBeEditedBy(?User $user): bool
    {
        return $user && ($user->isAdmin() || $this->isOwnedBy($user));
    }

    /**
     * Get user-friendly status label
     */
    private function getStatusLabel(): string
    {
        if (!$this->is_active) return 'Pending Approval';
        return $this->is_open ? 'Open Now' : 'Closed';
    }
}