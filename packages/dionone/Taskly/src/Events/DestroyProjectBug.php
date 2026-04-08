<?php

namespace DionONE\Taskly\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Taskly\Models\ProjectBug;

class DestroyProjectBug
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public ProjectBug $bug
    ) {}
}
