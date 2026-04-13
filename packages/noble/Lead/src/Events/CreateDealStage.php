<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\DealStage;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class CreateDealStage
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public DealStage $dealStage
    ) {}
}