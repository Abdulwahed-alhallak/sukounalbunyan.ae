<?php

namespace DionONE\Telegram\Listeners;

use DionONE\MachineRepairManagement\Events\CreateMachineRepairRequest;
use DionONE\MachineRepairManagement\Models\Machine;
use DionONE\Telegram\Services\SendMsg;

class CreateMachineRepairRequestLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateMachineRepairRequest $event)
    {
        $repair_request = $event->machinerepairrequest;
        $machine = Machine::find($repair_request->machine_id);
        if (company_setting('Telegram New Repair Request')  == 'on') {

            if(!empty($machine))
            {
                $uArr = [
                    'machine_name' => $machine->machine_name
                ];
                SendMsg::SendMsgs($uArr , 'New Repair Request');
            }
        }
    }
}
