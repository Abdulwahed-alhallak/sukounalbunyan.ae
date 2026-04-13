<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Label;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyLabel
{
    use Dispatchable;

    public function __construct(
        public Label $label
    ) {}
}