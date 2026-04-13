<?php

namespace Noble\Performance\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Performance\Models\PerformanceReviewCycle;

class DestroyReviewCycle
{
    use Dispatchable;

    public function __construct(
        public PerformanceReviewCycle $cycle
    ) {}
}