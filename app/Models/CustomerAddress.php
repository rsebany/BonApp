<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class CustomerAddress extends Pivot
{
    /** @use HasFactory<\Database\Factories\CustomerAddressFactory> */
    use HasFactory;

     protected $table = 'customer_addresses';
}
