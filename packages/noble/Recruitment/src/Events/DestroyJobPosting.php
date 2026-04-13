<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\JobPosting;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyJobPosting
{
    use Dispatchable;

    public function __construct(
        public JobPosting $jobposting
    ) {}
}