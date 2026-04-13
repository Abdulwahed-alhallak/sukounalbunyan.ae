<?php

namespace Noble\Slack\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Noble\Retainer\Events\CreateRetainer;
use Noble\Slack\Services\SendMsg;

class CreateRetainerLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateRetainer $event)
    {
        $retainer = $event->retainer;

        if (company_setting('Slack Create Retainer')  == 'on') {
            $uArr = [
                'retainer_id' => $retainer->retainer_number,
            ];

            SendMsg::SendMsgs($uArr, 'Create Retainer');
        }
    }
}