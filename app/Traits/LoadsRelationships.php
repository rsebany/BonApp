<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait LoadsRelationships
{
    /**
     * Load relationships based on request parameters
     */
    protected function loadRequestedRelationships(Builder $query, array $allowedRelationships = []): Builder
    {
        $with = request()->get('with', '');
        
        if (empty($with) || empty($allowedRelationships)) {
            return $query;
        }

        $requestedRelationships = array_filter(
            explode(',', $with),
            fn($relationship) => in_array(trim($relationship), $allowedRelationships)
        );

        if (!empty($requestedRelationships)) {
            $query->with(array_map('trim', $requestedRelationships));
        }

        return $query;
    }

    /**
     * Get default relationships for the resource
     */
    protected function getDefaultRelationships(): array
    {
        return [];
    }

    /**
     * Get allowed relationships for the resource
     */
    protected function getAllowedRelationships(): array
    {
        return [];
    }
}
