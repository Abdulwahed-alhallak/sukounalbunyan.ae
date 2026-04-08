<?php

namespace DionONE\Goal\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use DionONE\Account\Events\UpdateBudgetSpending;
use DionONE\Goal\Services\GoalService;

class UpdateBudgetSpendingLis
{
    protected $goalService;

    public function __construct(GoalService $goalService)
    {
        $this->goalService = $goalService;
    }

    public function handle(UpdateBudgetSpending $event)
    {
        if (Module_is_active('Goal')) {

            $this->goalService->autoContributeFromJournalEntry($event->journalEntry);
        }
    }
}
