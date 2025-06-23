<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderMenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'menu_item_id',
        'qty_ordered',
        'unit_price',
    ];

    protected function casts(): array
    {
        return [
            'qty_ordered' => 'integer',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(FoodOrder::class, 'order_id');
    }

    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class);
    }

    public function getItemTotalAttribute(): float
    {
        return $this->qty_ordered * $this->menuItem->price;
    }

    public function getFormattedItemTotalAttribute(): string
    {
        return number_format($this->getItemTotalAttribute(), 2);
    }
}