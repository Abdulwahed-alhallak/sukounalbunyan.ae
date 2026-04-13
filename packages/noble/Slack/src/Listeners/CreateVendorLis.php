<?php

namespace Noble\Slack\Listeners;

use Noble\Account\Events\CreateVendor;
use Noble\Slack\Services\SendMsg;

class CreateVendorLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateVendor $event)
    {
        if (company_setting('Slack New Vendor') == 'on') {
            $uArr = [];
            SendMsg::SendMsgs($uArr, 'New Vendor');
        }
    }
}