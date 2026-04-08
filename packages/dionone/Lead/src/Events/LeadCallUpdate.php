<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\LeadCall;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class LeadCallUpdate
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public LeadCall $leadCall
    ) {}
}