<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\Interview;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyInterview
{
    use Dispatchable;

    public function __construct(
        public Interview $interview
    ) {}
}