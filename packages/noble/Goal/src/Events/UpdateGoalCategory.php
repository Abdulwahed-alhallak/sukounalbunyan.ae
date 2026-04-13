<?php

namespace Noble\Goal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use Noble\Goal\Models\GoalCategory;

class UpdateGoalCategory
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public GoalCategory $category
    ) {}
}
