<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\InterviewType;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyInterviewType
{
    use Dispatchable;

    public function __construct(
        public InterviewType $interviewType
    ) {}
}