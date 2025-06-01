<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'status_value',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(FoodOrder::class);
    }

    public const PENDING = 'pending';
    public const CONFIRMED = 'confirmed';
    public const PREPARING = 'preparing';
    public const READY = 'ready';
    public const OUT_FOR_DELIVERY = 'out_for_delivery';
    public const DELIVERED = 'delivered';
    public const CANCELLED = 'cancelled';

    public static function getStatusOptions(): array
    {
        return [
            self::PENDING => 'Pending',
            self::CONFIRMED => 'Confirmed',
            self::PREPARING => 'Preparing',
            self::READY => 'Ready for Pickup',
            self::OUT_FOR_DELIVERY => 'Out for Delivery',
            self::DELIVERED => 'Delivered',
            self::CANCELLED => 'Cancelled',
        ];
    }
}