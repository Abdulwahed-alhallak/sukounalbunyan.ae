<?php

namespace Noble\Goal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Goal\Models\GoalMilestone;

class DestroyGoalMilestone
{
    use Dispatchable;

    public function __construct(
        public GoalMilestone $milestone
    ) {}
}