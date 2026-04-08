<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\Deal;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyDealSource
{
    use Dispatchable;

    public function __construct(
        public Deal $deal,
    ) {}
}