<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class OrderMenuItem extends Pivot
{
    /** @use HasFactory<\Database\Factories\OrderMenuItemFactory> */
    use HasFactory;

    protected $table = 'order_menu_items';

    protected $fillable = ['order_id', 'menu_item_id', 'qty_ordered'];
}
