<?php

namespace Noble\BudgetPlanner\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use Noble\BudgetPlanner\Models\BudgetPeriod;

class CloseBudgetPeriod
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public BudgetPeriod $budget_period
    ) {}
}
