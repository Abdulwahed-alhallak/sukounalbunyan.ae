<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\JobType;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyJobType
{
    use Dispatchable;

    public function __construct(
        public JobType $jobtype
    ) {}
}