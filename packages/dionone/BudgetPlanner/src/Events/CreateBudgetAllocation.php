<?php

namespace DionONE\BudgetPlanner\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use DionONE\BudgetPlanner\Models\BudgetAllocation;

class CreateBudgetAllocation
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public BudgetAllocation $budgetAllocation
    ) {}
}