<?php

namespace DionONE\Goal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Goal\Models\GoalContribution;

class DestroyGoalContribution
{
    use Dispatchable;

    public function __construct(
        public GoalContribution $goalContribution
    ) {}
}
