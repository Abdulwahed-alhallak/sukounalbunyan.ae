<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\LeadStage;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class UpdateLeadStage
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public LeadStage $leadStage
    ) {}
}