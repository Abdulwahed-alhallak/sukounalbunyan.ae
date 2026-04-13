<?php

namespace Noble\Taskly\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Taskly\Models\TaskStage;

class DestroyTaskStage
{
    use Dispatchable;

    public function __construct(
        public TaskStage $taskStage,
    ) {}
}