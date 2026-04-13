<?php

namespace Noble\Slack\Listeners;

use Noble\Slack\Services\SendMsg;
use Noble\Taskly\Events\CreateProjectMilestone;

class CreateProjectMilestoneLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateProjectMilestone $event)
    {
        if (company_setting('Slack New Milestone') == 'on') {
            $uArr = [];
            SendMsg::SendMsgs($uArr, 'New Milestone');
        }
    }
}