<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\Request;
use Noble\Hrm\Models\Attendance;

class CreateAttendance
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public Attendance $attendance
    ) {}
}