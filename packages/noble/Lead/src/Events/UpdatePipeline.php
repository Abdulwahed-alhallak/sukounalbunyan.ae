<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Pipeline;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class UpdatePipeline
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Pipeline $pipeline
    ) {}
}