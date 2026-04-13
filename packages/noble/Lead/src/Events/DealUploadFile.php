<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Deal;
use Noble\Lead\Models\DealFile;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class DealUploadFile
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Deal $deal,
    ) {}
}