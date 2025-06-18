<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CustomerAddress;
use App\Models\User;
use App\Models\Address;

class CustomerAddressSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('role', 'customer')->pluck('id');
        $addresses = Address::pluck('id');
        foreach ($customers as $customer_id) {
            CustomerAddress::factory()->create([
                'customer_id' => $customer_id,
                'address_id' => $addresses->random(),
            ]);
        }
    }
} 