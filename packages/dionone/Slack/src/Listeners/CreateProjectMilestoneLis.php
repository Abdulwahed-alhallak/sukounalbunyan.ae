<?php

namespace DionONE\Slack\Listeners;

use DionONE\Slack\Services\SendMsg;
use DionONE\Taskly\Events\CreateProjectMilestone;

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