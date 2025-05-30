<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerFactory> */
    use HasFactory;

    protected $fillable = ['first_name', 'last_name'];

    public function addresses()
    {
        return $this->belongsToMany(Address::class, 'customer_addresses')
            ->using(CustomerAddress::class)
            ->withPivot('id');
    }

    public function getNameAttribute(): string
    {
        return $this->first_name.' '.$this->last_name;
    }
}
