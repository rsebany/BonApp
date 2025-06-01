<?php

namespace App\Services;

use App\Models\MenuItem;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

class MenuItemService
{
    public function createMenuItem(User $user, Restaurant $restaurant, array $data): MenuItem
    {
        Gate::authorize('create', [MenuItem::class, $restaurant]);
        
        return $restaurant->menuItems()->create([
            'item_name' => $data['item_name'],
            'price' => $data['price'],
            'description' => $data['description'] ?? null
        ]);
    }

    public function updateMenuItem(User $user, MenuItem $menuItem, array $data): MenuItem
    {
        Gate::authorize('update', $menuItem);
        
        $menuItem->update($data);
        return $menuItem->fresh();
    }

    public function deleteMenuItem(User $user, MenuItem $menuItem): void
    {
        Gate::authorize('delete', $menuItem);
        
        $menuItem->delete();
    }
}