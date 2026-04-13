<?php

namespace Noble\Performance\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Performance\Models\PerformanceGoalType;

class DestroyGoalType
{
    use Dispatchable;

    public function __construct(
        public PerformanceGoalType $goalType
    ) {}
}