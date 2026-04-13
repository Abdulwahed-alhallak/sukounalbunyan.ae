<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\JobLocation;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyJobLocation
{
    use Dispatchable;

    public function __construct(
        public JobLocation $jobLocation
    ) {}
}