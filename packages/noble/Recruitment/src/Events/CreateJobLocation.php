<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\JobLocation;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class CreateJobLocation
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public JobLocation $jobLocation
    ) {}
}