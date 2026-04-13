<?php

namespace Noble\Performance\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Noble\Performance\Models\PerformanceIndicatorCategory;

class UpdatePerformanceIndicatorCategory
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public PerformanceIndicatorCategory $category
    ) {}
}