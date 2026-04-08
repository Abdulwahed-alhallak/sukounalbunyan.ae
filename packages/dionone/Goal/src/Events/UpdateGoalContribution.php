<?php

namespace DionONE\Goal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use DionONE\Goal\Models\GoalContribution;

class UpdateGoalContribution
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public GoalContribution $goalContribution
    ) {}
}
