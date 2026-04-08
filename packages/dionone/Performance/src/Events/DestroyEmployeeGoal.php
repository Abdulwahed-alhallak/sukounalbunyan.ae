<?php

namespace DionONE\Performance\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Performance\Models\PerformanceEmployeeGoal;

class DestroyEmployeeGoal
{
    use Dispatchable;

    public function __construct(
        public PerformanceEmployeeGoal $goal
    ) {}
}