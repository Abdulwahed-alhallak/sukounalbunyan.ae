<?php

namespace DionONE\Performance\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Performance\Models\PerformanceGoalType;

class DestroyGoalType
{
    use Dispatchable;

    public function __construct(
        public PerformanceGoalType $goalType
    ) {}
}