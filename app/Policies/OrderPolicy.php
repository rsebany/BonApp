<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\FoodOrder;
use App\Models\User;

class OrderPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, FoodOrder $foodOrder): bool
    {
        return $user->isAdmin() || $foodOrder->customer_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return !$user->isAdmin(); // Seuls les clients peuvent créer des commandes
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, FoodOrder $foodOrder): bool
    {
        // Admin ou restaurant propriétaire peut mettre à jour le statut
        return $user->isAdmin() || 
               $foodOrder->restaurant->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, FoodOrder $foodOrder): bool
    {
        // Seul le client peut annuler sa commande si elle est encore en attente
        return !$user->isAdmin() && 
               $foodOrder->customer_id === $user->id && 
               $foodOrder->order_status_id === 1; // Pending
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, FoodOrder $foodOrder): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, FoodOrder $foodOrder): bool
    {
        return false;
    }

    public function rate(User $user, FoodOrder $order): bool
    {
        // Seul le client peut noter après livraison
        return !$user->isAdmin() && 
               $order->customer_id === $user->id && 
               $order->order_status_id === 4 && // Delivered
               is_null($order->cust_restaurant_rating);
    }
}
