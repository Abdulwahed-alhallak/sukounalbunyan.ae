<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\CandidateSources;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyCandidateSources
{
    use Dispatchable;

    public function __construct(
        public CandidateSources $candidateSources
    ) {}
}