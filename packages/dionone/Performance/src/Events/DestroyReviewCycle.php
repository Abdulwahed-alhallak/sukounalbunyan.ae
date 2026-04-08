<?php

namespace DionONE\Performance\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Performance\Models\PerformanceReviewCycle;

class DestroyReviewCycle
{
    use Dispatchable;

    public function __construct(
        public PerformanceReviewCycle $cycle
    ) {}
}