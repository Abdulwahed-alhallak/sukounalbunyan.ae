<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\Department;

class DestroyDepartment
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public Department $department
    )
    {
        //
    }
}