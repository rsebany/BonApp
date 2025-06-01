<?php

namespace App\Services;

use App\Models\Address;
use App\Models\CustomerAddress;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\Eloquent\Collection;

class AddressService
{
    public function getUserAddresses(User $user): Collection
    {
        return $user->customerAddresses()->with('address')->get();
    }

    public function createAddress(User $user, array $data): CustomerAddress
    {
        $address = Address::create([
            'unit_number' => $data['unit_number'] ?? null,
            'street_number' => $data['street_number'],
            'address_line1' => $data['address_line1'],
            'address_line2' => $data['address_line2'] ?? null,
            'city' => $data['city'],
            'region' => $data['region'],
            'postal_code' => $data['postal_code'],
            'country_id' => $data['country_id']
        ]);

        return $user->customerAddresses()->create([
            'address_id' => $address->id
        ]);
    }

    public function updateAddress(User $user, CustomerAddress $customerAddress, array $data): CustomerAddress
    {
        Gate::authorize('update', $customerAddress);
        
        $customerAddress->address->update($data);
        return $customerAddress->fresh()->load('address');
    }

    public function deleteAddress(User $user, CustomerAddress $customerAddress): void
    {
        Gate::authorize('delete', $customerAddress);
        
        $address = $customerAddress->address;
        $customerAddress->delete();
        $address->delete();
    }
}