<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\Deal;
use DionONE\Lead\Models\DealDiscussion;
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