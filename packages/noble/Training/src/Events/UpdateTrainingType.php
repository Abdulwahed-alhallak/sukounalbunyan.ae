<?php

namespace Noble\Training\Events;

use Noble\Training\Models\TrainingType;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class UpdateTrainingType
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public TrainingType $trainingType
    ) {}
}