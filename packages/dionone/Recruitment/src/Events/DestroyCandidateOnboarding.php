<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\CandidateOnboarding;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyCandidateOnboarding
{
    use Dispatchable;

    public function __construct(
        public CandidateOnboarding $candidateOnboarding
    ) {}
}