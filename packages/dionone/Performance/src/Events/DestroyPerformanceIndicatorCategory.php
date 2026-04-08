<?php

namespace DionONE\Performance\Events;

use Illuminate\Foundation\Events\Dispatchable;
use DionONE\Performance\Models\PerformanceIndicatorCategory;

class DestroyPerformanceIndicatorCategory
{
    use Dispatchable;

    public function __construct(
        public PerformanceIndicatorCategory $category
    ) {}
}