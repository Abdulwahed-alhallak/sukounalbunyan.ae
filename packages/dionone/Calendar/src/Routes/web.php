<?php

use Illuminate\Support\Facades\Route;
use DionONE\Calendar\Http\Controllers\CalendarController;
use DionONE\Calendar\Http\Controllers\CalendarSettingsController;

Route::middleware(['web', 'auth', 'verified', 'PlanModuleCheck:Calendar'])->group(function () {
    Route::get('/calendar-view', [CalendarController::class, 'index'])->name('calendar.view.index');

    // Settings
    Route::get('calendar/settings', [CalendarSettingsController::class, 'index'])->name('calendar.settings.index');
    Route::post('calendar/settings/store', [CalendarSettingsController::class, 'store'])->name('calendar.settings.store');
});
