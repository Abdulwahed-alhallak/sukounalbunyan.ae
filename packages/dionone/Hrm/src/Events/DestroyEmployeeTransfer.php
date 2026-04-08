<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\EmployeeTransfer;

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