<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'opening_hours' => 'array',
        'minimum_order' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
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