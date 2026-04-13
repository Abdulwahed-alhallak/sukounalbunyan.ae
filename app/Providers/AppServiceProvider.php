<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Require helper file globally
        require_once app_path('Helpers/Helper.php');
        
        // Register Gamification Event Subscriber
        \Illuminate\Support\Facades\Event::subscribe(\App\Listeners\GamificationEventSubscriber::class);
        
        // Register Gamification Observer for Core Models
        if (class_exists(\App\Models\SalesInvoice::class)) {
            \App\Models\SalesInvoice::observe(\App\Observers\GamificationObserver::class);
            \App\Models\SalesInvoice::observe(\App\Observers\NobleFlowObserver::class);
        }
        
        // Register nobleflow Observers
        if (class_exists(\Noble\Lead\Models\Lead::class)) {
            \Noble\Lead\Models\Lead::observe(\App\Observers\NobleFlowObserver::class);
        }
        if (class_exists(\Noble\Hrm\Models\Employee::class)) {
            \Noble\Hrm\Models\Employee::observe(\App\Observers\NobleFlowObserver::class);
        }
    }
}

