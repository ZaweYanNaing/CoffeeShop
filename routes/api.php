<?php

use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\RewardsController;
use App\Http\Controllers\Api\UserSettingsController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Protected Routes
Route::middleware('auth.api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::put('/profile', [UserSettingsController::class, 'updateProfile']);
    Route::put('/password', [UserSettingsController::class, 'updatePassword']);

    // Orders
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    // Reservations
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations', [ReservationController::class, 'index']);

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Rewards
    Route::get('/rewards', [RewardsController::class, 'index']);
    Route::get('/rewards/products', [RewardsController::class, 'redeemableProducts']);

    // Admin Routes
    Route::middleware('is_admin')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);

        Route::put('/orders/{order}', [OrderController::class, 'update']);
        Route::put('/reservations/{reservation}', [ReservationController::class, 'update']);

        Route::get('/analytics/daily-income', [AnalyticsController::class, 'dailyIncome']);

        Route::get('/customers', [CustomerController::class, 'index']);
        Route::get('/customers/stats', [CustomerController::class, 'stats']);
        Route::get('/customers/{customer}', [CustomerController::class, 'show']);
        Route::post('/customers/{customer}/ban', [CustomerController::class, 'ban']);
        Route::post('/customers/{customer}/unban', [CustomerController::class, 'unban']);
    });
});
