<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home route with proper authentication redirects
Route::get('/', function () {
    if (auth()->check()) {
        return auth()->user()->role === 'admin'
             ? redirect()->route('admin.dashboard')
            : redirect()->route('user.dashboard');
    }
    return Inertia::render('home');
})->name('home');

// Authenticated user routes
Route::middleware(['auth', 'verified'])->group(function () {
    // User dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/User');
    })->name('user.dashboard');
    
    // User resources
    Route::resource('addresses', AddressController::class)->except(['edit', 'update']);
    Route::resource('orders', OrderController::class)->except(['edit', 'update']);
        
    // Restaurant routes
    Route::resource('restaurants', RestaurantController::class);
        
    // Menu items with proper shallow nesting
    Route::prefix('restaurants/{restaurant}')->group(function () {
        Route::resource('menu-items', MenuItemController::class)
            ->names([
                'index' => 'restaurants.menu-items.index',
                'create' => 'restaurants.menu-items.create',
                'store' => 'restaurants.menu-items.store',
                'show' => 'menu-items.show',
                'edit' => 'menu-items.edit',
                'update' => 'menu-items.update',
                'destroy' => 'menu-items.destroy',
            ])
            ->shallow();
    });
    
    // Order rating
    Route::post('orders/{order}/rate', [OrderController::class, 'rate'])
        ->name('orders.rate');
    
    // Profile routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
});

// Admin routes
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Admin dashboard
    Route::get('/', function () {
        // Double vérification du rôle
        if (auth()->user()->role !== 'admin') {
            return redirect('/dashboard');
        }
        return Inertia::render('Dashboard/Admin');
    })->name('dashboard');
        
    // Admin order management
    Route::resource('orders', AdminOrderController::class)
        ->only(['index', 'show', 'update'])
        ->names([
            'index' => 'orders.index',
            'show' => 'orders.show',
            'update' => 'orders.update',
        ]);
});

// Additional route files
require __DIR__.'/auth.php';
require __DIR__.'/settings.php';