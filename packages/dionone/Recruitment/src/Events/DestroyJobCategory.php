<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\JobCategory;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyJobCategory
{
    use Dispatchable;

    public function __construct(
        public JobCategory $jobCategory
    ) {}
}