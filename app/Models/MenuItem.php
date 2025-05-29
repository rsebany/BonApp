<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class menuItem extends Model
{
    /** @use HasFactory<\Database\Factories\MenuItemFactory> */
    use HasFactory;

    protected $fillable = ['restaurant_id', 'item_name', 'price'];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
