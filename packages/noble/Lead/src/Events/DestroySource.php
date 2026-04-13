<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Source;
use Illuminate\Foundation\Events\Dispatchable;

class DestroySource
{
    use Dispatchable;

    public function __construct(
        public Source $source
    ) {}
}