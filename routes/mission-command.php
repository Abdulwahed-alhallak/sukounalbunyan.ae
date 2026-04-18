<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'mission.command'])->prefix('mission-command')->name('mission-command.')->group(function () {
    // Mission Command Central Dashboard
    Route::get('/', function () {
        return \Inertia\Inertia::render('MissionCommand/Dashboard');
    })->name('dashboard');

    // Firebase Push Notification Hub
    Route::get('/notifications', function () {
        return \Inertia\Inertia::render('MissionCommand/NotificationsHub');
    })->name('notifications.index');
    
    // Mission Command Gamification
    Route::get('/gamification', [\App\Http\Controllers\MissionCommand\GamificationController::class, 'index'])->name('gamification.index');
    Route::post('/gamification/rules', [\App\Http\Controllers\MissionCommand\GamificationController::class, 'updateRules'])->name('gamification.rules.update');
    Route::post('/gamification/rules/new', [\App\Http\Controllers\MissionCommand\GamificationController::class, 'createRule'])->name('gamification.rules.create');
    Route::post('/gamification/test-award', [\App\Http\Controllers\MissionCommand\GamificationController::class, 'testAward'])->name('gamification.test-award');

    // NobleFlow Studio
    Route::get('/dionflow', [\App\Http\Controllers\NobleFlowController::class, 'index'])->name('dionflow');
    Route::post('/dionflow', [\App\Http\Controllers\NobleFlowController::class, 'store'])->name('dionflow.store');

    // Omnichannel Unified Inbox
    Route::get('/unified-inbox', [\App\Http\Controllers\UnifiedInboxController::class, 'index'])->name('unified-inbox');
    Route::post('/unified-inbox/send', [\App\Http\Controllers\UnifiedInboxController::class, 'sendMessage'])->name('unified-inbox.send');

    // Predictive Finance AI Telemetry
    Route::get('/predictive-finance', [\App\Http\Controllers\PredictiveFinanceController::class, 'index'])->name('predictive-finance');

    // Security and Growth Panels
    Route::get('/security-audit', [\App\Http\Controllers\SecurityAuditController::class, 'index'])->name('security-audit');
    Route::get('/affiliate-engine', [\App\Http\Controllers\AffiliateEngineController::class, 'index'])->name('affiliate-engine');

    // Firebase push dispatch
    Route::post('/notifications/send', [\App\Http\Controllers\MissionCommand\FirebaseNotificationController::class, 'send'])->name('notifications.send');
});
