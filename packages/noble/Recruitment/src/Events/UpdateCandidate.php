<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\Candidate;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class UpdateCandidate
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Candidate $candidate
    ) {}
}