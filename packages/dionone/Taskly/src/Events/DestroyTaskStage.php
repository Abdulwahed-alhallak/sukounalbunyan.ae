<?php

namespace DionONE\Taskly\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Taskly\Models\TaskStage;

class DestroyTaskStage
{
    use Dispatchable;

    public function __construct(
        public TaskStage $taskStage,
    ) {}
}