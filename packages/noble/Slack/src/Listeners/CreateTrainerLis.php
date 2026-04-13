<?php

namespace Noble\Slack\Listeners;

use Noble\Slack\Services\SendMsg;
use Noble\Training\Events\CreateTrainer;

class CreateTrainerLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateTrainer $event)
    {
        if (company_setting('Slack New Trainer')  == 'on') {
            $trainer = $event->trainer;

            $uArr = [
                'branch_name' => $trainer->branch->branch_name
            ];
            SendMsg::SendMsgs($uArr, 'New Trainer');
        }
    }
}
