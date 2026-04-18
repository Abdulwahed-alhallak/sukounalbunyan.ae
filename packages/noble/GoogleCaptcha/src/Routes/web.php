<?php

use Illuminate\Support\Facades\Route;
use Noble\GoogleCaptcha\Http\Controllers\GoogleCaptchaSettingsController;

// Protected Google Captcha settings routes
Route::middleware(['web', 'auth', 'verified', 'PlanModuleCheck:GoogleCaptcha'])->prefix('google-captcha')->name('google-captcha.')->group(function () {
    Route::get('/settings', [GoogleCaptchaSettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings/update', [GoogleCaptchaSettingsController::class, 'update'])->name('settings.update');
});
