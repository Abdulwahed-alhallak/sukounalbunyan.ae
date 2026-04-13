<?php

namespace Noble\BudgetPlanner\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\BudgetPlanner\Models\BudgetPeriod;

class DestroyBudgetPeriod
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public BudgetPeriod $budget_period
    ) {}
}
