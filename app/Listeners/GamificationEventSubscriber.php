<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Events\Dispatcher;
use App\Services\GamificationService;

class GamificationEventSubscriber
{
    /**
     * Handle user login events.
     */
    public function handleUserLogin(Login $event)
    {
        // Don't award points to superadmin usually, but for SaaS testing it's fine.
        // Prevent awarding daily login more than once per day:
        // Handled basically by checking if points were already awarded today (logic can be expanded in service).
        
        // For now, organically award points.
        GamificationService::awardPoints($event->user->id, 'daily_login');
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @param  \Illuminate\Events\Dispatcher  $events
     * @return void
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(
            Login::class,
            [GamificationEventSubscriber::class, 'handleUserLogin']
        );
    }
}
