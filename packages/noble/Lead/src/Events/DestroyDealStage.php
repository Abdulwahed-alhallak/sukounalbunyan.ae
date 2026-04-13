<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\DealStage;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyDealStage
{
    use Dispatchable;

    public function __construct(
        public DealStage $dealStage
    ) {}
}