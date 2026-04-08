<?php

namespace DionONE\Slack\Listeners;

use DionONE\Account\Events\CreateCustomer;
use DionONE\Slack\Services\SendMsg;

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