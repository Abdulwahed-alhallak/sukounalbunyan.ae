<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\JobPosting;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class CreateJobPosting
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public JobPosting $jobposting
    ) {}
}