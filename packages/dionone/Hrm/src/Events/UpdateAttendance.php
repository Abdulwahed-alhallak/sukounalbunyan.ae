<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\Request;
use DionONE\Hrm\Models\Attendance;

class UpdateAttendance
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public Attendance $attendance
    ) {

    }
}