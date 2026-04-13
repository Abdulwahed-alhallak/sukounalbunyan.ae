<?php

namespace Noble\Slack\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Noble\Lead\Events\CreateLead;
use Noble\Slack\Services\SendMsg;

class CreateLeadLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateLead $event)
    {
        if (company_setting('Slack New Lead') == 'on') {
            $uArr = [];

            SendMsg::SendMsgs($uArr, 'New Lead');
        }
    }
}