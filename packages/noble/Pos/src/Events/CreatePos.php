<?php

namespace Noble\Pos\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\Request;
use Noble\Pos\Models\Pos;

class CreatePos
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Request $request,
        public Pos $posSale
    ) {}
}