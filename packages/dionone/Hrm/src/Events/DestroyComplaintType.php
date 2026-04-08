<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use DionONE\Hrm\Models\ComplaintType;

class DestroyComplaintType
{
    use Dispatchable, SerializesModels;

    public function __construct(
          public ComplaintType $complaintType
    )
    {
        //
    }
}