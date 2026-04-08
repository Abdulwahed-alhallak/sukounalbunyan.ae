<?php

namespace DionONE\Slack\Listeners;

use DionONE\FormBuilder\Events\FormConverted;
use DionONE\Slack\Services\SendMsg;

class FormConvertedLis
{
    public function __construct()
    {
        //
    }

    public function handle(FormConverted $event)
    {
        if (company_setting('Slack Convert To Modal') == 'on') {
            $uArr = [];

            SendMsg::SendMsgs($uArr, 'Convert To Modal');
        }
    }
}