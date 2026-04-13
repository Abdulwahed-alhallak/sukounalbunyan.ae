<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\InterviewRound;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyInterviewRound
{
    use Dispatchable;

    public function __construct(
        public InterviewRound $interviewRound
    ) {}
}