<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\Interview;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class CreateInterview
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Interview $interview
    ) {}
}