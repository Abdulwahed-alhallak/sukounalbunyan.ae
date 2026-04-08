<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\DealStage;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyDealStage
{
    use Dispatchable;

    public function __construct(
        public DealStage $dealStage
    ) {}
}