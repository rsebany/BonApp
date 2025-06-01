<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FoodOrder extends Model
{
    protected $fillable = [
        'customer_id', 'restaurant_id', 'customer_address_id',
        'order_status_id', 'assigned_driver_id', 'order_date_time',
        'requested_delivery_date_time', 'delivery_fee', 'total_amount',
        'cust_driver_rating', 'cust_restaurant_rating'
    ];

    protected $casts = [
        'order_date_time' => 'datetime',
        'requested_delivery_date_time' => 'datetime'
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function customerAddress(): BelongsTo
    {
        return $this->belongsTo(CustomerAddress::class, 'customer_address_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(OrderStatus::class, 'order_status_id');
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'assigned_driver_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderMenuItem::class, 'order_id');
    }
}