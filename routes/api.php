<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuItemController;

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

// If you want to protect some API routes for admin use
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    // Protected admin API routes can go here if needed
});