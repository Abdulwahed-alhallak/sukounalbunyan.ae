<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\JobCategory;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyJobCategory
{
    use Dispatchable;

    public function __construct(
        public JobCategory $jobCategory
    ) {}
}