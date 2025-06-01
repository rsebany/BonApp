<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;

trait HasOwnership
{
    /**
     * Check if the authenticated user owns the given model
     */
    protected function userOwns(Model $model, ?string $ownerField = null): bool
    {
        $ownerField = $ownerField ?? $this->getOwnerField();
        
        return auth()->check() && 
               $model->{$ownerField} === auth()->id();
    }

    /**
     * Check if the authenticated user is admin or owns the model
     */
    protected function userCanAccess(Model $model, ?string $ownerField = null): bool
    {
        return auth()->check() && 
               (auth()->user()->isAdmin() || $this->userOwns($model, $ownerField));
    }

    /**
     * Get the default owner field name
     */
    protected function getOwnerField(): string
    {
        return 'customer_id';
    }
}