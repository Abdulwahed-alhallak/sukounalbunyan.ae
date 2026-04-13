<?php

namespace Noble\Slack\Listeners;

use Noble\CleaningManagement\Events\CreateCleaningTeam;
use Noble\Slack\Services\SendMsg;

class CreateCleaningTeamLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateCleaningTeam $event)
    {
        $cleaning_team = $event->cleaningTeam;

        if (company_setting('Slack New Cleaning Team') == 'on') {
            $uArr = [
                'team_name' => $cleaning_team->name
            ];

            SendMsg::SendMsgs($uArr, 'New Cleaning Team');
        }
    }
}