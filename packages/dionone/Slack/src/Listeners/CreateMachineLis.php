<?php

namespace DionONE\Slack\Listeners;

use DionONE\MachineRepairManagement\Events\CreateMachine;
use DionONE\Slack\Services\SendMsg;

class CreateMachineLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateMachine $event)
    {
        $machine = $event->machine;
        
        if (company_setting('Slack New Machine') == 'on') {
            $uArr = [
                'machine_name' => $machine->machine_name
            ];

            SendMsg::SendMsgs($uArr, 'New Machine');
        }
    }
}