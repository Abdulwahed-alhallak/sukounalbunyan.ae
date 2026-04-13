<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\Candidate;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyCandidate
{
    use Dispatchable;

    public function __construct(
        public Candidate $candidate
    ) {}
}