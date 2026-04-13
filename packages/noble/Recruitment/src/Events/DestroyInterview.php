<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\Interview;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyInterview
{
    use Dispatchable;

    public function __construct(
        public Interview $interview
    ) {}
}