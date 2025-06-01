<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Restaurant extends Model
{
    use HasFactory;

    protected $fillable = [
        'restaurant_name',
        'address_id',
    ];

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(FoodOrder::class);
    }

    public function getAverageRatingAttribute(): ?float
    {
        $avgRating = $this->orders()
            ->whereNotNull('customer_restaurant_rating')
            ->avg('customer_restaurant_rating');

        return $avgRating ? round($avgRating, 2) : null;
    }
}