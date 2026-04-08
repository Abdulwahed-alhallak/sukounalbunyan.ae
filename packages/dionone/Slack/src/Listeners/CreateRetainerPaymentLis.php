<?php

namespace DionONE\Slack\Listeners;

use DionONE\Retainer\Events\CreateRetainerPayment;
use DionONE\Slack\Services\SendMsg;

class CreateRetainerPaymentLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateRetainerPayment $event)
    {
        if (company_setting('Slack New Retainer Payment')  == 'on') {
            $uArr = [];

            SendMsg::SendMsgs($uArr, 'New Retainer Payment');
        }
    }
}