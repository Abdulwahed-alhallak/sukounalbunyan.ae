<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\Candidate;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyCandidate
{
    use Dispatchable;

    public function __construct(
        public Candidate $candidate
    ) {}
}