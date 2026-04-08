<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\Designation;

class DestroyDesignation
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public Designation $designation
    )
    {
        //
    }
}