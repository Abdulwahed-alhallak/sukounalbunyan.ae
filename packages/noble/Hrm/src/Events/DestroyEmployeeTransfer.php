<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Hrm\Models\EmployeeTransfer;

class DestroyEmployeeTransfer
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public EmployeeTransfer $employeeTransfer
    )
    {
        //
    }
}