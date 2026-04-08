<?php

namespace DionONE\Recruitment\Events;

use DionONE\Recruitment\Models\OnboardingChecklist;
use Illuminate\Foundation\Events\Dispatchable;

class DestroyOnboardingChecklist
{
    use Dispatchable;

    public function __construct(
        public OnboardingChecklist $onboardingchecklist
    ) {}
}