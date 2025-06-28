<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\CustomerAddress;
use App\Models\User;

class AddressPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Users can view their own addresses
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CustomerAddress $customerAddress): bool
    {
        return $user->id === $customerAddress->customer_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // Users can create addresses
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CustomerAddress $customerAddress): bool
    {
        return $user->id === $customerAddress->customer_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CustomerAddress $customerAddress): bool
    {
        return $user->id === $customerAddress->customer_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CustomerAddress $customerAddress): bool
    {
        return $user->id === $customerAddress->customer_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CustomerAddress $customerAddress): bool
    {
        return $user->id === $customerAddress->customer_id;
    }
}
