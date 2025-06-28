<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\Admin\ProfileController as ProfileAdmin;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Admin\SearchController as AdminSearchController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\RestaurantController as AdminRestaurantController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Admin\MenuItemController as AdminMenuItemController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\UserNotificationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Restaurant;
use Illuminate\Support\Facades\DB;

// Home route with proper authentication redirects
Route::get('/', function () {
    if (auth()->check()) {
        return auth()->user()->role === 'admin'
             ? redirect()->route('admin.dashboard')
            : redirect()->route('user.home');
    }

    $featuredRestaurants = Restaurant::with('address.country')
        ->active()
        ->latest()
        ->take(4)
        ->get();

    $localFavorites = Restaurant::with('address.country')
        ->active()
        ->latest()
        ->skip(4)
        ->take(2)
        ->get();

    $popularCategories = Restaurant::active()
        ->select('cuisine_type', DB::raw('count(*) as count'))
        ->groupBy('cuisine_type')
        ->orderBy('count', 'desc')
        ->take(5)
        ->get()
        ->map(function ($category) {
            $icons = [
                'American' => '🍔',
                'Italian' => '🍕',
                'Japanese' => '🍣',
                'Healthy' => '🥗',
                'Mexican' => '🌮',
                'Desserts' => '🍰',
            ];
            $images = [
                'American' => '/images/burger-cat.jpg',
                'Italian' => '/images/pizza-cat.jpg',
                'Japanese' => '/images/sushi-cat.jpg',
                'Healthy' => '/images/salad-cat.jpg',
                'Mexican' => '/images/tacos-cat.jpg',
                'Desserts' => '/images/dessert-cat.jpg',
            ];
            return [
                'name' => $category->cuisine_type,
                'count' => $category->count,
                'icon' => $icons[$category->cuisine_type] ?? '🍽️',
                'image' => $images[$category->cuisine_type] ?? '/images/default-cat.jpg',
            ];
        });


    return Inertia::render('home', [
        'featuredRestaurants' => $featuredRestaurants,
        'popularCategories' => $popularCategories,
        'localFavorites' => $localFavorites,
    ]);
})->name('home');

// Authenticated user routes
Route::middleware(['auth'])->group(function () {
    // User dashboard
    Route::get('/home', function () {
        return Inertia::render('Dashboard/User');
    })->name('user.home');
    
    // User resources
    Route::resource('addresses', AddressController::class);
    Route::resource('orders', OrderController::class)->except(['edit', 'update']);
        
    // Restaurant favorites page (must come before resource route)
    Route::get('restaurants/favorite', [RestaurantController::class, 'favorites'])
        ->name('restaurants.favorites');
        
    // Restaurant routes
    Route::resource('restaurants', RestaurantController::class);
    
    // Restaurant favorite toggle
    Route::post('restaurants/{restaurant}/favorite', [RestaurantController::class, 'toggleFavorite'])
        ->name('restaurants.favorite');
        
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
    
    // User notifications for sidebar
    Route::prefix('user/notifications')->group(function () {
        Route::get('/', [UserNotificationController::class, 'index'])->name('user.notifications.index');
        Route::patch('/{id}/read', [UserNotificationController::class, 'markAsRead'])->name('user.notifications.read');
        Route::patch('/read-all', [UserNotificationController::class, 'markAllAsRead'])->name('user.notifications.read-all');
        Route::get('/unread-count', [UserNotificationController::class, 'getUnreadCount'])->name('user.notifications.unread-count');
    });

    // User current orders for sidebar
    Route::prefix('user/orders')->group(function () {
        Route::get('/current', [OrderController::class, 'getCurrentOrders'])->name('user.orders.current');
        Route::get('/history', [OrderController::class, 'getOrderHistory'])->name('user.orders.history');
    });
    
    // Profile routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // User Order History
    Route::get('/user/orders/history', [OrderController::class, 'orderHistoryIndex'])->name('orders.history.index');
    Route::get('/user/orders/{id}/history', [OrderController::class, 'orderHistory'])->name('orders.history');
});

// Admin routes with role-based middleware
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Admin dashboard
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Admin search functionality
    Route::get('/search', [AdminSearchController::class, 'globalSearch'])->name('search');
    
    // Admin notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [AdminNotificationController::class, 'index'])->name('notifications.index');
        Route::get('/all', [AdminNotificationController::class, 'all'])->name('notifications.all');
        Route::patch('/{id}/read', [AdminNotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::patch('/read-all', [AdminNotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
        Route::get('/unread-count', [AdminNotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');
        Route::delete('/{id}', [AdminNotificationController::class, 'destroy'])->name('notifications.destroy');
        Route::delete('/bulk-delete', [AdminNotificationController::class, 'destroyMultiple'])->name('notifications.bulk-delete');
        Route::delete('/clear-all', [AdminNotificationController::class, 'clearAll'])->name('notifications.clear-all');
    });
    
    // Admin order management routes
    // Additional order routes (must come before resource route to avoid conflicts)
    Route::get('/orders/statistics', [AdminOrderController::class, 'statistics'])->name('orders.statistics');
    Route::get('/orders/tracking/{id}', [AdminOrderController::class, 'tracking'])->name('orders.tracking');
    Route::get('/orders/history/{id}', [AdminOrderController::class, 'history'])->name('orders.history');
    Route::get('/orders/export', [AdminOrderController::class, 'export'])->name('orders.export');
    Route::post('orders/bulk-update', [AdminOrderController::class, 'bulkUpdate'])->name('orders.bulk-update');
    Route::delete('orders/bulk-delete', [AdminOrderController::class, 'bulkDelete'])->name('orders.bulk-delete');
    Route::get('orders/stats', [AdminOrderController::class, 'stats'])->name('orders.stats');

    Route::resource('orders', AdminOrderController::class)
        ->names([
            'index' => 'orders.index',
            'create' => 'orders.create',
            'store' => 'orders.store',
            'show' => 'orders.show',
            'edit' => 'orders.edit',
            'update' => 'orders.update',
            'destroy' => 'orders.destroy',
        ]);

    // Additional route for fetching restaurant menu items
    Route::get('/restaurants/{restaurant}/menu-items', function (Restaurant $restaurant) {
        return response()->json(
            $restaurant->menuItems()->select('id', 'item_name', 'price')->get()
        );
    })->name('restaurants.menu-items');

    // Restaurant statistics route
    Route::get('/restaurants/statistics', [AdminRestaurantController::class, 'statistics'])->name('restaurants.statistics');
    Route::get('/restaurants/export', [AdminRestaurantController::class, 'export'])->name('restaurants.export');

    Route::resource('restaurants', AdminRestaurantController::class);
    
    // Admin user management
    // User statistics route
    Route::get('/users/statistics', [AdminUserController::class, 'statistics'])->name('users.statistics');
    Route::get('/users/export', [AdminUserController::class, 'export'])->name('users.export');
    
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
    Route::get('/reports', [AdminReportController::class, 'index'])
        ->name('reports.index');
    Route::get('/reports/sales', [AdminReportController::class, 'sales'])->name('reports.sales');
    Route::get('/reports/export', [AdminReportController::class, 'export'])->name('reports.export');

    // Admin settings
    Route::get('settings', [AdminSettingsController::class, 'index'])->name('settings');
    Route::put('settings', [AdminSettingsController::class, 'updateSettings'])->name('settings.update');
    Route::post('settings/maintenance-mode', [AdminSettingsController::class, 'toggleMaintenanceMode'])->name('settings.maintenance-mode');
    Route::get('settings/metrics', [AdminSettingsController::class, 'getSystemMetrics'])->name('settings.metrics');

    Route::get('settings/password', function () {
        return Inertia::render('admin/Settings/password');
    })->name('settings.password');

    Route::get('settings/appearance', function () {
        return Inertia::render('admin/Settings/appearance');
    })->name('settings.appearance');

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

// Public info pages
Route::get('/support', function () {
    return Inertia::render('Support');
})->name('support');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');