<?php

namespace Noble\Slack\Listeners;

use Noble\Recruitment\Events\ConvertOfferToEmployee;
use Noble\Slack\Services\SendMsg;

class ConvertOfferToEmployeeLis
{
    public function __construct()
    {
        //
    }

    public function handle(ConvertOfferToEmployee $event)
    {
        if (company_setting('Slack Convert To Employee')  == 'on') {
            $uArr =  [];
            SendMsg::SendMsgs($uArr, 'Convert To Employee');
        }
    }
}