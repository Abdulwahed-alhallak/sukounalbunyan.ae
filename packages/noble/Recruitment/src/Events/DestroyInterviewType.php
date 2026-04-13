<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\InterviewType;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyInterviewType
{
    use Dispatchable;

    public function __construct(
        public InterviewType $interviewType
    ) {}
}