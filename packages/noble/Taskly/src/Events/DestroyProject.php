<?php

namespace Noble\Taskly\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Taskly\Models\Project;

class DestroyProject
{
    use Dispatchable;

    public function __construct(
        public Project $project
    ) {}
}
