<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\CandidateOnboarding;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyCandidateOnboarding
{
    use Dispatchable;

    public function __construct(
        public CandidateOnboarding $candidateOnboarding
    ) {}
}