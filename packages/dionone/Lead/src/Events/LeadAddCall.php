<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\Lead;
use DionONE\Lead\Models\LeadCall;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class LeadAddCall
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Lead $lead,
    ) {}
}