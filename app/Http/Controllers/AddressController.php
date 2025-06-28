<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\CustomerAddress;
use App\Services\AddressService;
use Inertia\Inertia;

class AddressController extends Controller
{
    use AuthorizesRequests;
    
    public function __construct(
        protected AddressService $addressService
    ) {}

    public function index()
    {
        $addresses = $this->addressService->getUserAddresses(auth()->user());
        
        return Inertia::render('User/Addresses/index', [
            'addresses' => $addresses,
            'canCreate' => true
        ]);
    }

    public function create()
    {
        return Inertia::render('User/Addresses/create', [
            'countries' => \App\Models\Country::all()
        ]);
    }

    public function store(StoreAddressRequest $request)
    {
        $address = $this->addressService->createAddress(
            auth()->user(),
            $request->validated()
        );
        
        return redirect()->route('addresses.index')
            ->with('success', 'Address created successfully');
    }

    public function show(CustomerAddress $address)
    {
        $this->authorize('view', $address);
        
        return Inertia::render('User/Addresses/show', [
            'address' => $address->load('address.country'),
            'canUpdate' => auth()->user()->can('update', $address),
            'canDelete' => auth()->user()->can('delete', $address)
        ]);
    }

    public function edit(CustomerAddress $address)
    {
        $this->authorize('update', $address);
        
        return Inertia::render('User/Addresses/edit', [
            'address' => $address->load('address.country'),
            'countries' => \App\Models\Country::all()
        ]);
    }

    public function update(UpdateAddressRequest $request, CustomerAddress $address)
    {
        $this->addressService->updateAddress(
            auth()->user(),
            $address,
            $request->validated()
        );
        
        return redirect()->route('addresses.index')
            ->with('success', 'Address updated successfully');
    }

    public function destroy(CustomerAddress $address)
    {
        $this->authorize('delete', $address);
        
        $this->addressService->deleteAddress(auth()->user(), $address);
        
        return redirect()->route('addresses.index')
            ->with('success', 'Address deleted successfully');
    }

    // API method to get user addresses for the location selector
    public function getUserAddresses()
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        
        $addresses = $this->addressService->getUserAddresses($user);
        
        return response()->json([
            'addresses' => $addresses->filter(function ($customerAddress) {
                return $customerAddress->address !== null;
            })->map(function ($customerAddress) {
                return [
                    'id' => $customerAddress->address->id,
                    'address_line1' => $customerAddress->address->address_line1,
                    'city' => $customerAddress->address->city,
                    'region' => $customerAddress->address->region,
                    'postal_code' => $customerAddress->address->postal_code,
                    'country' => $customerAddress->address->country ? [
                        'country_name' => $customerAddress->address->country->country_name,
                    ] : null,
                ];
            })->values(),
        ]);
    }
}