<?php

namespace Noble\Slack\Listeners;

use Noble\Account\Events\CreateCustomer;
use Noble\Slack\Services\SendMsg;

class CreateCustomerLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateCustomer $event)
    {
        if (company_setting('Slack New Customer') == 'on') {
            $uArr = [];
            SendMsg::SendMsgs($uArr, 'New Customer');
        }
    }
}