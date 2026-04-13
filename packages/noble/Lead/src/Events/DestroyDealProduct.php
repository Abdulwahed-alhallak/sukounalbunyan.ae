<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Deal;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyDealProduct
{
    use Dispatchable;

    public function __construct(
        public Deal $deal,
    ) {}
}