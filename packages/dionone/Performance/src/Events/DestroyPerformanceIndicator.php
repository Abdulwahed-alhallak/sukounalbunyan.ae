<?php

namespace DionONE\Performance\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Performance\Models\PerformanceIndicator;

class DestroyPerformanceIndicator
{
    use Dispatchable;

    public function __construct(
        public PerformanceIndicator $indicator
    ) {}
}