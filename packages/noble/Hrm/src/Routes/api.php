<?php

use Illuminate\Support\Facades\Route;
use Noble\Hrm\Http\Controllers\Api\AttendanceApiController;
use Noble\Hrm\Http\Controllers\Api\DashboardApiController;
use Noble\Hrm\Http\Controllers\Api\HolidayApiController;
use Noble\Hrm\Http\Controllers\Api\LeaveApiController;
use Noble\Hrm\Http\Controllers\Api\LeaveTypeApiController;

Route::prefix('api')->middleware(['api.json'])->group(function () {
    Route::group(['middleware' => ['auth:sanctum'], 'prefix' => 'hrm'], function () {
        Route::get('home', [DashboardApiController::class, 'index']);
        Route::post('events', [DashboardApiController::class, 'getEvents']);
        Route::get('holidays-list', [HolidayApiController::class, 'index']);
        
        Route::post('attendence-history', [AttendanceApiController::class, 'history']);
        Route::post('clock-in-out', [AttendanceApiController::class, 'clockInOut']);
        
        Route::get('get-leaves', [LeaveApiController::class, 'index']);
        Route::post('leave-request', [LeaveApiController::class, 'store']);
        
        Route::get('get-leaves-types', [LeaveTypeApiController::class, 'index']);
        
        // Biometric Integration Routes
        Route::post('biometrics/sync', [\Noble\Hrm\Http\Controllers\Api\BiometricApiController::class, 'syncLogs']);
    });
});