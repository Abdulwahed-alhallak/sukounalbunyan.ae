<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Lead;
use Noble\Lead\Models\LeadFile;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyLeadFile
{
    use Dispatchable;

    public function __construct(
        public Lead $lead,
    ) {}
}