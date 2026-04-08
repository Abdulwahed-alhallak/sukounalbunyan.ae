<?php

namespace DionONE\Taskly\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Taskly\Models\TaskComment;

class DestroyTaskComment
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public TaskComment $comment
    ) {}
}
