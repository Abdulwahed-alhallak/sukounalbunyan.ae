<?php

namespace DionONE\Telegram\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use DionONE\InnovationCenter\Events\CreateCreativity;
use DionONE\Telegram\Services\SendMsg;

class CreateCreativityLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateCreativity $event)
    {
        $creativity = $event->creativity;
        $challenge = $creativity->Challenge;

        if (company_setting('Telegram New Creativity')  == 'on') {

            $uArr = [
                'name' => $creativity->creativity_name,
                'challenge' => !empty($challenge) ? $challenge->challenge_name : '-',
            ];
            SendMsg::SendMsgs($uArr , 'New Creativity');
        }
    }
}
