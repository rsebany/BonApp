<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Restaurant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'restaurant_name',
        'email',
        'phone',
        'description',
        'cuisine_type',
        'opening_hours',
        'delivery_time',
        'minimum_order',
        'delivery_fee',
        'is_active',
        'address_id',
        'rating',
        'price_range',
        'image',
        'tags',
        'featured_dish',
        'latitude',
        'longitude',
        'review_count',
        'min_order',
        'distance_km',
        'image_url',
        'special_offer',
        'is_open',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'opening_hours' => 'array',
        'minimum_order' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'tags' => 'array',
        'rating' => 'float',
        'latitude' => 'float',
        'longitude' => 'float',
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

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * The users who have marked this restaurant as favorite.
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorite_restaurant_user', 'restaurant_id', 'user_id')->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getFullAddressAttribute()
    {
        if (!$this->address) return null;
        
        $address = $this->address;
        $parts = [
            $address->address_line1,
            $address->address_line2,
            $address->city,
            $address->region,
            $address->postal_code,
            $address->country->country_name ?? null
        ];
        
        return implode(', ', array_filter($parts));
    }
}