<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyUserLead
{
    use Dispatchable;

    public function __construct(
        public Lead $lead,
    ) {}
}