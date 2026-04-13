<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Lead;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyLeadSource
{
    use Dispatchable;

    public function __construct(
        public Lead $lead,
    ) {}
}