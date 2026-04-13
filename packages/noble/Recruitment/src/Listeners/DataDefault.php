<?php

namespace Noble\Recruitment\Listeners;

use App\Events\DefaultData;
use Noble\Recruitment\Models\Job;

class DataDefault
{
    public function handle(DefaultData $event)
    {
        $company_id = $event->company_id;
        $user_module = $event->user_module ? explode(',', $event->user_module) : [];
        
        if (!empty($user_module) && in_array("Recruitment", $user_module)) {
            Job::defaultdata($company_id);
        }
    }
}