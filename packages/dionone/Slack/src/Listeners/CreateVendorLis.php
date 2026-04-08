<?php

namespace DionONE\Slack\Listeners;

use DionONE\Account\Events\CreateVendor;
use DionONE\Slack\Services\SendMsg;

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