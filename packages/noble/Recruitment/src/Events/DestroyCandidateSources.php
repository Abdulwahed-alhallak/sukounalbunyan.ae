<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\CandidateSources;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyCandidateSources
{
    use Dispatchable;

    public function __construct(
        public CandidateSources $candidateSources
    ) {}
}