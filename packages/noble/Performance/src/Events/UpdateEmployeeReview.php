<?php

namespace Noble\Performance\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Noble\Performance\Models\PerformanceEmployeeReview;

class UpdateEmployeeReview
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public PerformanceEmployeeReview $review
    ) {}
}