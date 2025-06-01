<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Country extends Model
{
    protected $fillable = ['country_name'];

    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }
}
