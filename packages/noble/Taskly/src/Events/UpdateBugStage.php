<?php

namespace Noble\Taskly\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Noble\Taskly\Models\BugStage;

class UpdateBugStage
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public BugStage $bugStage
    ) {}
}