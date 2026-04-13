<?php

namespace Noble\Taskly\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Taskly\Models\BugComment;

class DestroyBugComment
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public BugComment $comment
    ) {}
}
