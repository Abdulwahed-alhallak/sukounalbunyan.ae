<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Lead;
use Noble\Lead\Models\Deal;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class LeadConvertDeal
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Lead $lead,
    ) {}
}