<?php

namespace DionONE\Slack\Listeners;

use DionONE\InnovationCenter\Events\CreateChallenge;
use DionONE\Slack\Services\SendMsg;

class CreateChallengeLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateChallenge $event)
    {
        $Challenges = $event->challenge;
        
        $statusMap = [
            0 => 'OnGoing',
            1 => 'OnHold',
            2 => 'Finished',
        ];

        $positionName = $statusMap[$Challenges->position] ?? '-';

        if (company_setting('Slack New Challenge') == 'on') {
            $uArr = [
                'name' => $Challenges->challenge_name,
                'position' => $positionName
            ];

            SendMsg::SendMsgs($uArr, 'New Challenge');
        }
    }
}
