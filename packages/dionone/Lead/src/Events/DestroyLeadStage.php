<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\LeadStage;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyLeadStage
{
    use Dispatchable;

    public function __construct(
        public LeadStage $leadStage
    ) {}
}