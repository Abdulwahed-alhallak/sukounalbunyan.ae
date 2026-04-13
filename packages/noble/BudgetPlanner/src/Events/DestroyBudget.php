<?php

namespace Noble\BudgetPlanner\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\BudgetPlanner\Models\Budget;

class DestroyBudget
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Budget $budget
    ) {}
}
