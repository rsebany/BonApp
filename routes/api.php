<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Public API routes (no authentication required for AJAX calls)
Route::get('/menu-items', [MenuItemController::class, 'getMenuItems']);

// Order tracking API routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/orders/{id}/tracking', [AdminOrderController::class, 'getTrackingData']);
    Route::post('/orders/{id}/tracking-update', [AdminOrderController::class, 'addTrackingUpdate']);
});

// If you want to protect some API routes for admin use
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Protected admin API routes can go here if needed
});