<?php

namespace Noble\Slack\Listeners;

use Noble\Sales\Events\CreateSalesMeeting;
use Noble\Slack\Services\SendMsg;

class CreateSalesMeetingLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateSalesMeeting $event)
    {
        $request = $event->meeting;

        if (company_setting('Slack Meeting Assigned') == 'on') {
            $uArr = [
                'meeting_name' => $request->name
            ];

            SendMsg::SendMsgs($uArr, 'Meeting Assigned');
        }
    }
}