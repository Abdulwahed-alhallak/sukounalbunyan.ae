<?php

namespace Noble\Slack\Listeners;

use Noble\Retainer\Events\CreateRetainerPayment;
use Noble\Slack\Services\SendMsg;

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