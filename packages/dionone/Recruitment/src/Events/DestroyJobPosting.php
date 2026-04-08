<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\JobPosting;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyJobPosting
{
    use Dispatchable;

    public function __construct(
        public JobPosting $jobposting
    ) {}
}