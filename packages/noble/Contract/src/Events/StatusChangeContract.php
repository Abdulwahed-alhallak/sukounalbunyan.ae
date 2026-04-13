<?php

namespace Noble\Contract\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Noble\Contract\Models\Contract;

class StatusChangeContract
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Contract $contract
    ) {}
}