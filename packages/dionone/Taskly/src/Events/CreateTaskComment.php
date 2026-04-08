<?php

namespace DionONE\Taskly\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use DionONE\Taskly\Models\TaskComment;

class CreateTaskComment
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public TaskComment $comment
    ) {}
}