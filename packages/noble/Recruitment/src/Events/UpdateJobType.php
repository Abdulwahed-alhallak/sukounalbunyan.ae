<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\JobType;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class UpdateJobType
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public JobType $jobtype
    ) {}
}