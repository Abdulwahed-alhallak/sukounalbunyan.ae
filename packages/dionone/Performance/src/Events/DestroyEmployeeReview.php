<?php

namespace DionONE\Performance\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Performance\Models\PerformanceEmployeeReview;

class DestroyEmployeeReview
{
    use Dispatchable;

    public function __construct(
        public PerformanceEmployeeReview $review
    ) {}
}