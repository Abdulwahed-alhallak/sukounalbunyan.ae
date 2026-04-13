<?php

namespace Noble\Performance\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Performance\Models\PerformanceEmployeeReview;

class DestroyEmployeeReview
{
    use Dispatchable;

    public function __construct(
        public PerformanceEmployeeReview $review
    ) {}
}