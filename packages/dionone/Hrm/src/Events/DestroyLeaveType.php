<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\LeaveType;

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