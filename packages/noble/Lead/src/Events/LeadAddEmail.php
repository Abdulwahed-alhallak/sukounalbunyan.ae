<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Lead;
use Noble\Lead\Models\LeadEmail;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class LeadAddEmail
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Lead $lead,
        public LeadEmail $lead_email,
    ) {}
}