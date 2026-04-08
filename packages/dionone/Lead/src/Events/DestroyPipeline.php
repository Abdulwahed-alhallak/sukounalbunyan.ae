<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\Pipeline;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyPipeline
{
    use Dispatchable;

    public function __construct(
        public Pipeline $pipeline
    ) {}
}