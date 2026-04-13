<?php

namespace Noble\Training\Events;

use Noble\Training\Models\Trainer;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class UpdateTrainer
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public Trainer $trainer
    ) {}
}