<?php

namespace Noble\Performance\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Noble\Performance\Models\PerformanceIndicatorCategory;

class DestroyPerformanceIndicatorCategory
{
    use Dispatchable;

    public function __construct(
        public PerformanceIndicatorCategory $category
    ) {}
}