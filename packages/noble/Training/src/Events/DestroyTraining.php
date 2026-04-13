<?php

namespace Noble\Training\Events;

use Noble\Training\Models\Training;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyTraining
{
    use Dispatchable;

    public function __construct(
        public Training $training
    ) {}
}