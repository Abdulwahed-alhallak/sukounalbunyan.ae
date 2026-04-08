<?php

namespace DionONE\Slack\Listeners;

use DionONE\Sales\Events\CreateSalesMeeting;
use DionONE\Slack\Services\SendMsg;

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