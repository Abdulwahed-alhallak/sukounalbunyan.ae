<?php

namespace Noble\Slack\Listeners;

use Noble\InnovationCenter\Events\CreateCreativity;
use Noble\InnovationCenter\Models\Challenge;
use Noble\Slack\Services\SendMsg;

class CreateCreativityLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateCreativity $event)
    {
        $creativity = $event->creativity;
        $challenge = Challenge::find($creativity->challenge_id);

        if (company_setting('Slack New Creativity') == 'on') {
            $uArr = [
                'name' => $creativity->creativity_name,
                'challenge' => !empty($challenge) ? $challenge->challenge_name : '-',
            ];

            SendMsg::SendMsgs($uArr, 'New Creativity');
        }
    }
}
