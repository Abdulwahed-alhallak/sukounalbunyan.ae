<?php

namespace DionONE\Lead\Events;

use DionONE\Lead\Models\Source;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class UpdateSource
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Source $source
    ) {}
}