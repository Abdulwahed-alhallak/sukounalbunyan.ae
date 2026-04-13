<?php

namespace Noble\Slack\Listeners;

use Noble\Contract\Events\CreateContract;
use Noble\Contract\Models\Contract;
use Noble\Slack\Services\SendMsg;

class CreateContractLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateContract $event)
    {
        $contract = $event->contract;

        if (company_setting('Slack New Contract') == 'on') {
            $uArr = [
                'contract_number' => $contract->contract_number,
            ];

            SendMsg::SendMsgs($uArr, 'New Contract');
        }
    }
}
