<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\Admin\ProfileController as ProfileAdmin;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\RestaurantController as AdminRestaurantController;
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

    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        // Orders
        Route::get('/orders/tracking/{id}', [AdminOrderController::class, 'tracking'])->name('orders.tracking');
        Route::get('/orders/statistics', [AdminOrderController::class, 'statistics'])->name('orders.statistics');
        Route::get('/orders/history/{id}', [AdminOrderController::class, 'history'])->name('orders.history');
        Route::get('/orders/export', [AdminOrderController::class, 'export'])->name('orders.export');
        Route::resource('orders', AdminOrderController::class);
    });
});

// Admin routes with role-based middleware
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Admin dashboard
    Route::get('/', function () {
        return Inertia::render('Dashboard/Admin');
    })->name('dashboard');
    
    // Admin order management routes
    Route::resource('orders', AdminOrderController::class)->names([
        'index' => 'orders.index',
        'create' => 'orders.create',
        'store' => 'orders.store',
        'show' => 'orders.show',
        'edit' => 'orders.edit',
        'update' => 'orders.update',
        'destroy' => 'orders.destroy',
    ]);
    
    // Additional order routes
    Route::post('orders/bulk-update', [AdminOrderController::class, 'bulkUpdate'])
        ->name('orders.bulk-update');
    
    Route::get('orders/stats', [AdminOrderController::class, 'stats'])
        ->name('orders.stats');

    Route::get('orders/{order}/tracking', [AdminOrderController::class, 'tracking'])
    ->name('orders.tracking');


    Route::resource('restaurants', AdminRestaurantController::class);
    
    // Admin user management
    Route::resource('users', AdminUserController::class)
    ->only(['index', 'show', 'create', 'store', 'edit', 'update', 'destroy'])
    ->names([
        'index' => 'users.index',
        'create' => 'users.create',
        'store' => 'users.store',
        'show' => 'users.show',
        'edit' => 'users.edit',
        'update' => 'users.update',
        'destroy' => 'users.destroy',
    ]);
    
    // Admin reports
    Route::get('reports', [AdminReportController::class, 'index'])
        ->name('reports.index');

    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileAdmin::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileAdmin::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileAdmin::class, 'destroy'])->name('profile.destroy');
    });
});

// Logout route
Route::post('/logout', function () {
    auth()->logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout');

// Additional route files
require __DIR__.'/auth.php';
require __DIR__.'/settings.php';