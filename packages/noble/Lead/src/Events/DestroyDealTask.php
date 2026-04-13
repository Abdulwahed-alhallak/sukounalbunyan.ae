<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\DealTask;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyDealTask
{
    use Dispatchable;

    public function __construct(
        public DealTask $dealTask
    ) {}
}