<?php

namespace DionONE\Telegram\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use DionONE\Account\Events\CreateBankTransfer;
use DionONE\Telegram\Services\SendMsg;

class CreateBankTransferLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateBankTransfer $event)
    {
        $data = $event->bankTransfer;
        if (company_setting('Telegram Bank Transfer Payment Status Updated')  == 'on') {
            if(!empty($data))
            {
                $uArr = [
                    'invoice_id' => $data->transfer_number
                ];
            }
            SendMsg::SendMsgs($uArr , 'Bank Transfer Payment Status Updated');
        }
    }
}
