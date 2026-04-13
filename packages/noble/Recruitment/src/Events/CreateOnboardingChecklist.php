<?php

namespace Noble\Recruitment\Events;

use Noble\Recruitment\Models\OnboardingChecklist;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;

class CreateOnboardingChecklist
{
    use Dispatchable;

    public function __construct(
        public Request $request,
        public OnboardingChecklist $onboardingchecklist
    ) {}
}