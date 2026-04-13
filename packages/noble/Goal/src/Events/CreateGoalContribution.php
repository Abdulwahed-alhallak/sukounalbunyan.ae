<?php

namespace Noble\Goal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Noble\Goal\Models\GoalContribution;

class CreateGoalContribution
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public GoalContribution $goalContribution
    ) {}
}
