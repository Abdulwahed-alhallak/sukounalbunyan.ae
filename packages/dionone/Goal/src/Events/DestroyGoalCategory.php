<?php

namespace DionONE\Goal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Goal\Models\GoalCategory;

class DestroyGoalCategory
{
    use Dispatchable;

    public function __construct(
        public GoalCategory $category
    ) {}
}
