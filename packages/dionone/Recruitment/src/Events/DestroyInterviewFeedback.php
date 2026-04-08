<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\InterviewFeedback;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyInterviewFeedback
{
    use Dispatchable;

    public function __construct(
        public InterviewFeedback $interviewFeedback
    ) {}
}