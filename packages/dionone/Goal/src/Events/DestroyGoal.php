<?php

namespace DionONE\Goal\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Goal\Models\Goal;

class DestroyGoal
{
    use Dispatchable;

    public function __construct(
        public Goal $goal
    ) {}
}