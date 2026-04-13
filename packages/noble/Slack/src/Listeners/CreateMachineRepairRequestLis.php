<?php

namespace Noble\Slack\Listeners;

use Noble\MachineRepairManagement\Events\CreateMachineRepairRequest;
use Noble\MachineRepairManagement\Models\Machine;
use Noble\Slack\Services\SendMsg;

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
        
        if (company_setting('Slack New Repair Request') == 'on') {
            $uArr = [
                'machine_name' => $machine->machine_name
            ];

            SendMsg::SendMsgs($uArr, 'New Repair Request');
        }
    }
}