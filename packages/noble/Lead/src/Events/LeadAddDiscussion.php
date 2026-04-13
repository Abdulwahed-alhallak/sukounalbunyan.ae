<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Lead;
use Noble\Lead\Models\LeadDiscussion;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class LeadAddDiscussion
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Lead $lead,
    ) {}
}