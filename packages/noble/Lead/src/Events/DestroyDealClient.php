<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Deal;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyDealClient
{
    use Dispatchable;

    public function __construct(
        public Deal $deal,
    ) {}
}