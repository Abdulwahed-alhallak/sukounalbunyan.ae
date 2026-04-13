<?php

namespace Noble\Goal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Goal\Models\GoalTracking;

class DestroyGoalTracking
{
    use Dispatchable;

    public function __construct(
        public GoalTracking $tracking
    ) {}
}
