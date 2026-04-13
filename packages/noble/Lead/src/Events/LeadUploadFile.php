<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Lead;
use Noble\Lead\Models\LeadFile;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class LeadUploadFile
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Lead $lead,
    ) {}
}