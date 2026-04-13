<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\JobCategory;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class CreateJobCategory
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public JobCategory $jobCategory
    ) {}
}