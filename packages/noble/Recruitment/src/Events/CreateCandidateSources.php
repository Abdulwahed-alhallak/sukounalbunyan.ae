<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\CandidateSources;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class CreateCandidateSources
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public CandidateSources $candidateSources
    ) {}
}