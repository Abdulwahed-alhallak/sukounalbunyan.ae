<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\Request;
use Noble\Hrm\Models\Shift;

class CreateShift
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public Shift $shift
    ) {}
}