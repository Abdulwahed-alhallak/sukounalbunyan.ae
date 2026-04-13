<?php

namespace Noble\Hrm\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\Request;
use Noble\Hrm\Models\Award;

class UpdateAward
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public Award $award
    ) {

    }
}