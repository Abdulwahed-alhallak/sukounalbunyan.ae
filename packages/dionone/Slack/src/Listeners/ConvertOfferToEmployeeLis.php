<?php

namespace DionONE\Slack\Listeners;

use DionONE\Recruitment\Events\ConvertOfferToEmployee;
use DionONE\Slack\Services\SendMsg;

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