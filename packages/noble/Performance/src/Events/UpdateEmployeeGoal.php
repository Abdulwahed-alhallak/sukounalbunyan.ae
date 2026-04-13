<?php

namespace Noble\Performance\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Noble\Performance\Models\PerformanceEmployeeGoal;

class UpdateEmployeeGoal
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public PerformanceEmployeeGoal $goal
    ) {}
}