<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Deal;
use Noble\Lead\Models\DealEmail;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class DealAddEmail
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Deal $deal,
        public DealEmail $deal_email,
    ) {}
}