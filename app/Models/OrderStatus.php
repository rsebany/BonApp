<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderStatus extends Model
{
    protected $fillable = [
        'name',
        'color',
        'sort_order',
        'is_default',
        'description'
    ];

    protected $casts = [
        'is_default' => 'boolean'
    ];

    public function orders()
    {
        return $this->hasMany(FoodOrder::class);
    }

    public static function getDefaultStatus()
    {
        return self::where('is_default', true)->first();
    }
}