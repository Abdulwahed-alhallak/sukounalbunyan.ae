<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\GeofencedTrackerController;

Route::middleware('api.json')->group(function () {

    Route::post('/login', [AuthApiController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        Route::post('/logout', [AuthApiController::class, 'logout']);
        Route::post('/refresh', [AuthApiController::class, 'refresh']);
        Route::post('/change-password', [AuthApiController::class, 'changePassword']);
        Route::post('/edit-profile', [AuthApiController::class, 'editProfile']);
        Route::delete('/delete-account', [AuthApiController::class, 'deleteAccount']);

        // Geofenced Project Tracking API
        Route::post('/projects/clock-in', [GeofencedTrackerController::class, 'clockIn']);
        Route::post('/projects/clock-out', [GeofencedTrackerController::class, 'clockOut']);
    });
});
