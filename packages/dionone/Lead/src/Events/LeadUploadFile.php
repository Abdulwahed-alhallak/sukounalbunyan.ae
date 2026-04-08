<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\Lead;
use DionONE\Lead\Models\LeadFile;
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