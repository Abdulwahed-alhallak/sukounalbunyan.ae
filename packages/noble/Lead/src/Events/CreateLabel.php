<?php

namespace Noble\Lead\Events;

use Noble\Lead\Models\Label;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class CreateLabel
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Label $label
    ) {}
}