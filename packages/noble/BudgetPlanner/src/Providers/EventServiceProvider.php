<?php

namespace Noble\BudgetPlanner\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Noble\Account\Events\UpdateBudgetSpending;
use Noble\BudgetPlanner\Listeners\UpdateBudgetSpendingLis;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        UpdateBudgetSpending::class => [
            UpdateBudgetSpendingLis::class,
        ],
    ];
}
