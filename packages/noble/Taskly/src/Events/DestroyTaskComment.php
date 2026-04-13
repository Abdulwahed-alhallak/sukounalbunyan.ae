<?php

namespace Noble\Taskly\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Taskly\Models\TaskComment;

class DestroyTaskComment
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public TaskComment $comment
    ) {}
}
