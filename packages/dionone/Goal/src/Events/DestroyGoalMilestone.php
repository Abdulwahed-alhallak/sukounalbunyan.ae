<?php

namespace DionONE\Goal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Goal\Models\GoalMilestone;

class DestroyGoalMilestone
{
    use Dispatchable;

    public function __construct(
        public GoalMilestone $milestone
    ) {}
}