<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\DealCall;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyDealCall
{
    use Dispatchable;

    public function __construct(
        public DealCall $dealCall
    ) {}
}