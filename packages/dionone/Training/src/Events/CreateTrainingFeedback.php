<?php

namespace DionONE\Training\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;
use DionONE\Training\Models\TrainingFeedback;

class CreateTrainingFeedback
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public TrainingFeedback $feedback
    ) {}
}