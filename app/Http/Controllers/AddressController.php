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
        
        return Inertia::render('Addresses/Index', [
            'addresses' => $addresses,
            'canCreate' => true
        ]);
    }

    public function create()
    {
        return Inertia::render('Addresses/Create', [
            'countries' => \App\Models\Country::all()
        ]);
    }

    public function store(StoreAddressRequest $request)
    {
        $address = $this->addressService->createAddress(
            auth()->user(),
            $request->validated()
        );
        
        return redirect()->route('addresses.show', $address)
            ->with('success', 'Adresse créée avec succès');
    }

    public function show(CustomerAddress $address)
    {
        $this->authorize('view', $address);
        
        return Inertia::render('Addresses/Show', [
            'address' => $address->load('address'),
            'canUpdate' => auth()->user()->can('update', $address),
            'canDelete' => auth()->user()->can('delete', $address)
        ]);
    }

    public function edit(CustomerAddress $address)
    {
        $this->authorize('update', $address);
        
        return Inertia::render('Addresses/Edit', [
            'address' => $address->load('address'),
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
        
        return redirect()->route('addresses.show', $address)
            ->with('success', 'Adresse mise à jour avec succès');
    }

    public function destroy(CustomerAddress $address)
    {
        $this->authorize('delete', $address);
        
        $this->addressService->deleteAddress(auth()->user(), $address);
        
        return redirect()->route('addresses.index')
            ->with('success', 'Adresse supprimée avec succès');
    }
}