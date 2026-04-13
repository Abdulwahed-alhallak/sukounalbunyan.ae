<?php

namespace Noble\Training\Events;

use Noble\Training\Models\TrainingType;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyTrainingType
{
    use Dispatchable;

    public function __construct(
        public TrainingType $trainingType
    ) {}
}