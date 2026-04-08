<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\Deal;
use DionONE\Lead\Models\DealFile;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyDealFile
{
    use Dispatchable;

    public function __construct(
        public Deal $deal,
    ) {}
}