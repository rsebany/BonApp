<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_number',
        'street_number',
        'address_line1',
        'address_line2',
        'city',
        'region',
        'postal_code',
        'country_id',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function restaurant(): HasOne
    {
        return $this->hasOne(Restaurant::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(FoodOrder::class, 'customer_address_id');
    }

    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->unit_number ? "Unit {$this->unit_number}" : null,
            $this->street_number,
            $this->address_line1,
            $this->address_line2,
            $this->city,
            $this->region,
            $this->postal_code,
            $this->country?->country_name,
        ]);

        return implode(', ', $parts);
    }

    public function getShortAddressAttribute()
    {
        $parts = array_filter([
            $this->address_line1,
            $this->city,
            $this->region,
        ]);

        return implode(', ', $parts);
    }
}