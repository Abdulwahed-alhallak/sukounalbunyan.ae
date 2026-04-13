<?php

namespace Noble\Performance\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Performance\Models\PerformanceIndicator;

class DestroyPerformanceIndicator
{
    use Dispatchable;

    public function __construct(
        public PerformanceIndicator $indicator
    ) {}
}