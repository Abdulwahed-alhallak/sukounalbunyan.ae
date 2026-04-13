<?php

namespace Noble\Telegram\Listeners;

use Noble\MachineRepairManagement\Events\CreateMachine;
use Noble\Telegram\Services\SendMsg;

class CreateMachineLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateMachine $event)
    {
        $machine = $event->machine;
        if (company_setting('Telegram New Machine')  == 'on') {

            if(!empty($machine))
            {
                $uArr = [
                    'machine_name' => $machine->machine_name
                ];
                SendMsg::SendMsgs($uArr , 'New Machine');
            }
        }
    }
}
