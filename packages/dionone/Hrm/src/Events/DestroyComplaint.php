<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\Complaint;

class DestroyComplaint
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public Complaint $complaint
    )
    {
        //
    }
}