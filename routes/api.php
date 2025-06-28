<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\ReviewController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Test route to verify API routes work
Route::get('/test-api', function () {
    return response()->json(['message' => 'API routes are working']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Public API routes (no authentication required for AJAX calls)
Route::get('/menu-items', [MenuItemController::class, 'getMenuItems']);
Route::get('/restaurants', [RestaurantController::class, 'getRestaurants']);

// User addresses API route
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user/addresses', [AddressController::class, 'getUserAddresses']);
});

// Review routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/restaurants/{restaurant}/reviews', [ReviewController::class, 'index']);
    Route::post('/restaurants/{restaurant}/reviews', [ReviewController::class, 'store']);
    Route::get('/restaurants/{restaurant}/reviews/{review}', [ReviewController::class, 'show']);
    Route::put('/restaurants/{restaurant}/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/restaurants/{restaurant}/reviews/{review}', [ReviewController::class, 'destroy']);
    Route::patch('/restaurants/{restaurant}/reviews/{review}/toggle-verification', [ReviewController::class, 'toggleVerification']);
});

// Order tracking API routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/orders/{id}/tracking', [AdminOrderController::class, 'getTrackingData']);
    Route::post('/orders/{id}/tracking-update', [AdminOrderController::class, 'addTrackingUpdate']);
});

// If you want to protect some API routes for admin use
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Protected admin API routes can go here if needed
});

// Fallback debug route for testing
Route::fallback(function () {
    return response()->json(['error' => 'API route not found'], 404);
});