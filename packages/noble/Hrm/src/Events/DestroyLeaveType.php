<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Hrm\Models\LeaveType;

class DestroyLeaveType
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public LeaveType $leavetype
    )
    {
        //
    }
}