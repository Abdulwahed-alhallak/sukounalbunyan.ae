<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\LeaveApplication;

class DestroyLeaveApplication
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public LeaveApplication $leaveapplication
    )
    {
        //
    }
}