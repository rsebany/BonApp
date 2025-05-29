<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerAddressController;
use \App\Http\Controllers\RestaurantController;
use App\Http\Controllers\FoodOrderController;
use App\Http\Controllers\OrderMenuItemController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\MenuItemController;

// Authentication and Dashboard Routes
Route::redirect('/', 'dashboard');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', fn() => Inertia::render('dashboard') 
        )->name('dashboard');

    // Customers with addresses
    Route::resource('customers', CustomerController::class);
    Route::resource('customers.addresses', CustomerAddressController::class)
        ->only(['store', 'destroy'])
        ->shallow();

    // Restaurants with menu items
    Route::resource('restaurants', RestaurantController::class);
    Route::resource('restaurants.menu-items', MenuItemController::class)
        ->except(['index', 'show']);

    // Orders with items and ratings
    Route::resource('orders', FoodOrderController::class);
    Route::resource('orders.items', OrderMenuItemController::class)
        ->only(['store', 'destroy']);
    
    Route::post('orders/{order}/rate-restaurant', [FoodOrderController::class, 'rateRestaurant'])
        ->name('orders.rate-restaurant');
    Route::post('orders/{order}/rate-driver', [FoodOrderController::class, 'rateDriver'])
        ->name('orders.rate-driver');

    // Standalone resources
    Route::resource('addresses', AddressController::class)
        ->except(['index', 'show']);
    Route::resource('countries', CountryController::class)
        ->except(['create', 'edit']);
});

    // Public routes
    Route::prefix('public')->group(function () {
    Route::get('restaurants', [RestaurantController::class, 'index'])
        ->name('public.restaurants.index');
    Route::get('restaurants/{restaurant}', [RestaurantController::class, 'show'])
        ->name('public.restaurants.show');
    Route::get('restaurants/{restaurant}/menu', [MenuItemController::class, 'index'])
        ->name('public.menu-items.index');
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
