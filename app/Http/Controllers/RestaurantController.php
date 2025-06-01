<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRestaurantRequest;
use App\Http\Requests\UpdateRestaurantRequest;
use App\Models\Address;
use App\Models\Restaurant;
use App\Http\Controllers\Controller; 
use App\Services\RestaurantService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class RestaurantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    use AuthorizesRequests;
    public function __construct(
        protected RestaurantService $restaurantService
    ) {}
    
    public function index()
    {
        $restaurants = $this->restaurantService->getAllRestaurants(auth()->user());
        
        return Inertia::render('Restaurants/Index', [
            'restaurants' => $restaurants,
            'canCreate' => auth()->user()->can('create', Restaurant::class)
        ]);
    }

    public function create()
    {
        $this->authorize('create', Restaurant::class);
        
        return Inertia::render('Restaurants/Create', [
            'addresses' => Address::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRestaurantRequest $request)
    {
        $restaurant = $this->restaurantService->createRestaurant(
            auth()->user(),
            $request->validated()
        );
        
        return redirect()->route('restaurants.show', $restaurant)
            ->with('success', 'Restaurant créé avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show(Restaurant $restaurant)
    {
        $this->authorize('view', $restaurant);
        
        return Inertia::render('Restaurants/Show', [
            'restaurant' => $restaurant->load(['address', 'menuItems']),
            'canUpdate' => auth()->user()->can('update', $restaurant),
            'canDelete' => auth()->user()->can('delete', $restaurant)
        ]);
    }

    public function edit(Restaurant $restaurant)
    {
        $this->authorize('update', $restaurant);
        
        return Inertia::render('Restaurants/Edit', [
            'restaurant' => $restaurant,
            'addresses' => Address::all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRestaurantRequest $request, Restaurant $restaurant)
    {
        $this->restaurantService->updateRestaurant(
            auth()->user(),
            $restaurant,
            $request->validated()
        );
        
        return redirect()->route('restaurants.show', $restaurant)
            ->with('success', 'Restaurant mis à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Restaurant $restaurant)
    {
        $this->authorize('delete', $restaurant);
        
        $this->restaurantService->deleteRestaurant(
            auth()->user(),
            $restaurant
        );
        
        return redirect()->route('restaurants.index')
            ->with('success', 'Restaurant supprimé avec succès');
    }
}