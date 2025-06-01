<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderMenuItem extends Model
{
    protected $fillable = ['order_id', 'menu_item_id', 'qty_ordered', 'unit_price'];

    public function order(): BelongsTo
    {
        return $this->belongsTo(FoodOrder::class, 'order_id');
    }

    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class, 'menu_item_id');
    }
}
