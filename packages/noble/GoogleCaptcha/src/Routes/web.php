<?php

use Illuminate\Support\Facades\Route;
use Noble\GoogleCaptcha\Http\Controllers\GoogleCaptchaSettingsController;

// Protected Google Captcha settings routes
Route::middleware(['web', 'auth', 'verified', 'PlanModuleCheck:GoogleCaptcha'])->group(function () {
    Route::post('/google-captcha/settings/update', [GoogleCaptchaSettingsController::class, 'update'])->name('google-captcha.settings.update');
});