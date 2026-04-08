<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'mission.command'])->prefix('mission-command')->name('mission-command.')->group(function () {
    
    // Mission Command Central Dashboard
    Route::get('/', function () {
        return \Inertia\Inertia::render('mission-command/Dashboard');
    })->name('dashboard');

    // Firebase Push Notification Hub
    Route::get('/notifications', function () {
        return \Inertia\Inertia::render('mission-command/NotificationsHub');
    })->name('notifications.index');
    
    // Mission Command Gamification
    Route::get('/gamification', [\App\Http\Controllers\MissionCommand\GamificationController::class, 'index'])->name('gamification.index');
    Route::post('/gamification/rules', [\App\Http\Controllers\MissionCommand\GamificationController::class, 'updateRules'])->name('gamification.rules.update');
    Route::post('/gamification/rules/new', [\App\Http\Controllers\MissionCommand\GamificationController::class, 'createRule'])->name('gamification.rules.create');

    // Here we will map any API controllers we build later for Firebase pushing
    Route::post('/notifications/send', [\App\Http\Controllers\MissionCommand\FirebaseNotificationController::class, 'send'])->name('notifications.send');
});
