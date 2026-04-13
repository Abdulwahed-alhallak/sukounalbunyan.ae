<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\Request;
use Noble\Hrm\Models\Resignation;

class UpdateResignaionStatus
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public Resignation $resignation
    ) {}
}