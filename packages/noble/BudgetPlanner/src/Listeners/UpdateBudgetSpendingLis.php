<?php

namespace Noble\BudgetPlanner\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Noble\Account\Events\UpdateBudgetSpending;
use Noble\BudgetPlanner\Services\BudgetService;

class UpdateBudgetSpendingLis
{
    protected $budgetService;

    public function __construct(BudgetService $budgetService)
    {
        $this->budgetService = $budgetService;
    }

    public function handle(UpdateBudgetSpending $event)
    {
        if (Module_is_active('BudgetPlanner')) {

            $this->budgetService->updateBudgetSpendingForAccounts($event->journalEntry);
        }
    }
}
