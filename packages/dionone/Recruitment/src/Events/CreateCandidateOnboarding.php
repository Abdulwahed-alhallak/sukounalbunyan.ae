<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\CandidateOnboarding;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class CreateCandidateOnboarding
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public CandidateOnboarding $candidateOnboarding
    ) {}
}