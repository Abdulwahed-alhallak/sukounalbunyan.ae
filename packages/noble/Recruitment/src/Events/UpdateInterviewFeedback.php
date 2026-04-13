<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\InterviewFeedback;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class UpdateInterviewFeedback
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public InterviewFeedback $interviewFeedback
    ) {}
}