<?php

namespace Database\Factories;

use App\Models\CustomerAddress;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerAddressFactory extends Factory
{
    protected $model = CustomerAddress::class;

    public function definition(): array
    {
        return [
            'customer_id' => \App\Models\User::where('role', 'customer')->inRandomOrder()->first()?->id ?? 1,
            'address_id' => \App\Models\Address::inRandomOrder()->first()?->id ?? 1,
        ];
    }
} 