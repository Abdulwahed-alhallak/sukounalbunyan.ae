<?php

namespace Noble\BudgetPlanner\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\BudgetPlanner\Models\BudgetAllocation;

class DestroyBudgetAllocation
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public BudgetAllocation $budget_allocation
    ) {}
}
