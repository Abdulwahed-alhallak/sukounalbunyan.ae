<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\CandidateSources;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class UpdateCandidateSources
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public CandidateSources $candidateSources
    ) {}
}