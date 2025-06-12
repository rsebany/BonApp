<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderTrackingUpdate extends Model
{
    protected $fillable = [
        'order_id',
        'driver_id',
        'latitude',
        'longitude',
        'status',
        'description',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(FoodOrder::class, 'order_id');
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
} 