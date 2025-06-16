<?php

// app/Models/Restaurant.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
        'image_path',
        'is_active',
        'address_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'delivery_time' => 'integer',
        'minimum_order' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }

    public function orders()
    {
        return $this->hasMany(FoodOrder::class);
    }

    // Accessors
    public function getImageUrlAttribute()
    {
        if ($this->image_path) {
            return asset('storage/' . $this->image_path);
        }
        return asset('images/default-restaurant.png');
    }

    public function getFullAddressAttribute()
    {
        if (!$this->address) {
            return '';
        }

        $parts = array_filter([
            $this->address->unit_number,
            $this->address->street_number,
            $this->address->address_line1,
            $this->address->address_line2,
            $this->address->city,
            $this->address->region,
            $this->address->postal_code,
            $this->address->country->country_name ?? '',
        ]);

        return implode(', ', $parts);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    public function scopeByCity($query, $city)
    {
        return $query->whereHas('address', function ($q) use ($city) {
            $q->where('city', 'like', "%{$city}%");
        });
    }

    public function scopeByCuisine($query, $cuisine)
    {
        return $query->where('cuisine_type', 'like', "%{$cuisine}%");
    }
}
