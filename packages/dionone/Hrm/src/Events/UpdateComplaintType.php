<?php

namespace DionONE\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\Request;
use DionONE\Hrm\Models\ComplaintType;

class UpdateComplaintType
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public ComplaintType $complaintType
    ) {

    }
}