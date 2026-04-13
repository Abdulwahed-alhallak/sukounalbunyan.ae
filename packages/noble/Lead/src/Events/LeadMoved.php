<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Lead;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class LeadMoved
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Lead $lead
    ) {}
}