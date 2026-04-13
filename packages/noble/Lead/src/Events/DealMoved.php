<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Deal;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class DealMoved
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Deal $deal
    ) {}
}