<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FoodOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'restaurant_id',
        'customer_address_id',
        'order_status_id',
        'assigned_driver_id',
        'order_datetime',
        'delivery_fee',
        'total_amount',
        'requested_delivery_datetime',
        'customer_driver_rating',
        'customer_restaurant_rating',
    ];

    protected function casts(): array
    {
        return [
            'order_datetime' => 'datetime',
            'requested_delivery_datetime' => 'datetime',
            'delivery_fee' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'customer_driver_rating' => 'integer',
            'customer_restaurant_rating' => 'integer',
        ];
    }

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
        return $this->belongsTo(Address::class, 'customer_address_id');
    }

    public function orderStatus(): BelongsTo
    {
        return $this->belongsTo(OrderStatus::class, 'order_status_id');
    }

    public function assignedDriver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_driver_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderMenuItem::class, 'order_id');
    }

    public function getFormattedTotalAttribute(): string
    {
        return number_format($this->total_amount, 2);
    }

    public function getFormattedDeliveryFeeAttribute(): string
    {
        return number_format($this->delivery_fee, 2);
    }

    public function getSubtotalAttribute(): float
    {
        return $this->total_amount - $this->delivery_fee;
    }

    public function getFormattedSubtotalAttribute(): string
    {
        return number_format($this->getSubtotalAttribute(), 2);
    }

    public function canBeRated(): bool
    {
        return $this->orderStatus->name === OrderStatus::DELIVERED;
    }

    public function isDelivered(): bool
    {
        return $this->orderStatus->name === OrderStatus::DELIVERED;
    }

    public function isCancelled(): bool
    {
        return $this->orderStatus->name === OrderStatus::CANCELLED;
    }

    public function isPending(): bool
    {
        return $this->orderStatus->name === OrderStatus::PENDING;
    }

    public function orderStatusHistory()
    {
        return $this->hasMany(OrderStatusHistory::class, 'order_id');
    }

    public function trackingUpdates()
    {
        return $this->hasMany(OrderTrackingUpdate::class, 'order_id');
    }

    protected static function booted()
    {
        static::updated(function ($order) {
            if ($order->isDirty('order_status_id')) {
                $order->orderStatusHistory()->create([
                    'status' => $order->orderStatus->name,
                    'description' => 'Order status updated to ' . $order->orderStatus->name,
                    'updated_by_id' => auth()->id(),
                ]);
            }
        });
    }
}