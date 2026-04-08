<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\InterviewRound;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyInterviewRound
{
    use Dispatchable;

    public function __construct(
        public InterviewRound $interviewRound
    ) {}
}