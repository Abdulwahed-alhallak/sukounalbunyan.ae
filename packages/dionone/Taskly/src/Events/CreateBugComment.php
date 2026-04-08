<?php

namespace DionONE\Taskly\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use DionONE\Taskly\Models\BugComment;

class CreateBugComment
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public BugComment $comment
    ) {}
}
