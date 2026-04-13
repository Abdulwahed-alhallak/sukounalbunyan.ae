<?php

namespace Noble\BudgetPlanner\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use Noble\BudgetPlanner\Models\Budget;

class UpdateBudget
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public Budget $budget
    ) {}
}