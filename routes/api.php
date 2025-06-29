<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserNotificationController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController; 

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ----------------------
// Public API Endpoints
// ----------------------

// Auth
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'apiLogin']);

// Restaurants & Menu Items
Route::get('/restaurants', [RestaurantController::class, 'getRestaurants']);
Route::get('/restaurants/{restaurant}', [RestaurantController::class, 'show']);
Route::get('/restaurants/{restaurant}/menu-items', [MenuItemController::class, 'getMenuItems']);

// ----------------------
// Authenticated User API
// ----------------------
Route::middleware(['auth:sanctum'])->group(function () {
    // User Profile
    Route::get('/user', function (Request $request) { return $request->user(); });
    Route::put('/user', [ProfileController::class, 'apiUpdate']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'apiLogout']);

    // Addresses
    Route::get('/user/addresses', [AddressController::class, 'getUserAddresses']);
    Route::post('/user/addresses', [AddressController::class, 'apiStore']);
    Route::put('/user/addresses/{address}', [AddressController::class, 'apiUpdate']);
    Route::delete('/user/addresses/{address}', [AddressController::class, 'apiDestroy']);

    // Orders
    Route::get('/user/orders', [OrderController::class, 'apiIndex']);
    Route::post('/user/orders', [OrderController::class, 'apiStore']);
    Route::get('/user/orders/{order}', [OrderController::class, 'apiShow']);
    Route::post('/user/orders/{order}/rate', [OrderController::class, 'rate']);
    Route::get('/user/orders/history', [OrderController::class, 'getOrderHistory']);

    // Favorites
    Route::get('/user/restaurants/favorites', [RestaurantController::class, 'favorites']);
    Route::post('/user/restaurants/{restaurant}/favorite', [RestaurantController::class, 'toggleFavorite']);

    // Reviews (user: only create/list)
    Route::get('/restaurants/{restaurant}/reviews', [ReviewController::class, 'index']);
    Route::post('/restaurants/{restaurant}/reviews', [ReviewController::class, 'store']);

    // Notifications
    Route::get('/user/notifications', [UserNotificationController::class, 'index']);
    Route::patch('/user/notifications/{id}/read', [UserNotificationController::class, 'markAsRead']);
    Route::patch('/user/notifications/read-all', [UserNotificationController::class, 'markAllAsRead']);
    Route::get('/user/notifications/unread-count', [UserNotificationController::class, 'getUnreadCount']);
});

// ----------------------
// Admin API Endpoints
// ----------------------
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Order tracking
    Route::get('/orders/{id}/tracking', [AdminOrderController::class, 'getTrackingData']);
    Route::post('/orders/{id}/tracking-update', [AdminOrderController::class, 'addTrackingUpdate']);
    // Add more admin routes as needed
});

// Fallback for undefined routes
Route::fallback(function () {
    return response()->json(['error' => 'API route not found'], 404);
});