<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoodOrder extends Model
{
    /** @use HasFactory<\Database\Factories\FoodOrderFactory> */
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'restaurant_id',
        'customer_address_id',
        'order_status_id',
        'assigned_driver_id',
        'order_date_time',
        'delivery_fee',
        'total_amount',
        'requested_delivery_date_time',
        'cust_driver_rating',
        'cust_restaurant_rating'
    ];

    protected $casts = [
        'order_date_time' => 'datetime',
        'requested_delivery_date_time' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function customerAddress()
    {
        return $this->belongsTo(CustomerAddress::class, 'customer_address_id');
    }

    public function status()
    {
        return $this->belongsTo(OrderStatus::class, 'order_status_id');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'assigned_driver_id');
    }

    public function menuItems()
    {
        return $this->belongsToMany(MenuItem::class, 'order_menu_items')
            ->withPivot('qty_ordered')
            ->withTimestamps();
    }
}
