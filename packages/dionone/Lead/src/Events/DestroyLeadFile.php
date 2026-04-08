<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\Lead;
use DionONE\Lead\Models\LeadFile;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyLeadFile
{
    use Dispatchable;

    public function __construct(
        public Lead $lead,
    ) {}
}