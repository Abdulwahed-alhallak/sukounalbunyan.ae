<?php

namespace DionONE\Goal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Goal\Models\GoalTracking;

class DestroyGoalTracking
{
    use Dispatchable;

    public function __construct(
        public GoalTracking $tracking
    ) {}
}
