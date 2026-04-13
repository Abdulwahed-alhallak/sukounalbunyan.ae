<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Deal;
use Noble\Lead\Models\DealFile;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyDealFile
{
    use Dispatchable;

    public function __construct(
        public Deal $deal,
    ) {}
}