<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\Request;
use Noble\Hrm\Models\Warning;

class CreateWarning
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public Warning $warning
    ) {}
}