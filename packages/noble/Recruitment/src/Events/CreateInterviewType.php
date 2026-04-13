<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\InterviewType;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class CreateInterviewType
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public InterviewType $interviewType
    ) {}
}