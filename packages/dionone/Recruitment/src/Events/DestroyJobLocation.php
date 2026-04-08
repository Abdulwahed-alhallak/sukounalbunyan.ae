<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\JobLocation;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyJobLocation
{
    use Dispatchable;

    public function __construct(
        public JobLocation $jobLocation
    ) {}
}