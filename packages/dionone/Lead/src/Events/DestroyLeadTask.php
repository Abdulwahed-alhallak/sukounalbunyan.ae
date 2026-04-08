<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\LeadTask;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyLeadTask
{
    use Dispatchable;

    public function __construct(
        public LeadTask $leadTask
    ) {}
}