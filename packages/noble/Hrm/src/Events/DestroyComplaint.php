<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Noble\Hrm\Models\Complaint;

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