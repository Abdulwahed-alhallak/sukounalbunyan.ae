<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Deal;
use Noble\Lead\Models\DealDiscussion;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class DealAddDiscussion
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Deal $deal,
    ) {}
}