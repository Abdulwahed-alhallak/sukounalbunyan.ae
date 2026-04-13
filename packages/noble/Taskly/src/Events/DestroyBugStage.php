<?php

namespace Noble\Taskly\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Taskly\Models\BugStage;

class DestroyBugStage
{
    use Dispatchable;

    public function __construct(
        public BugStage $bugStage,
    ) {}
}