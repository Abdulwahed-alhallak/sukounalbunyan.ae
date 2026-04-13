<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\Request;
use Noble\Hrm\Models\Complaint;

class CreateComplaint
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public Complaint $complaint
    ) {}
}