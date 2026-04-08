<?php

namespace DionONE\Taskly\Events;

use Illuminate\Http\Request;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Taskly\Models\ProjectTask;

class UpdateProjectTaskStage
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public ProjectTask $task
    ) {}
}
