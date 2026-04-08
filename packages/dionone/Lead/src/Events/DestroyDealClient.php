<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\Deal;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyDealClient
{
    use Dispatchable;

    public function __construct(
        public Deal $deal,
    ) {}
}