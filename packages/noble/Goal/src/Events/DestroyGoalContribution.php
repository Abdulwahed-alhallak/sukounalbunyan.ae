<?php

namespace Noble\Goal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Goal\Models\GoalContribution;

class DestroyGoalContribution
{
    use Dispatchable;

    public function __construct(
        public GoalContribution $goalContribution
    ) {}
}
