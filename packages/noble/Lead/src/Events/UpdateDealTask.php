<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\DealTask;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class UpdateDealTask
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public DealTask $dealTask
    ) {}
}