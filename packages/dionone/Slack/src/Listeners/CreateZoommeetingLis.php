<?php

namespace DionONE\Slack\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use DionONE\Slack\Services\SendMsg;
use DionONE\ZoomMeeting\Events\CreateZoomMeeting;

class CreateZoommeetingLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateZoomMeeting $event)
    {
        $meeting = $event->meeting;
        $name = $meeting->title;
        $date = $meeting->start_time; 

        if (company_setting('Slack New Zoom Meeting') == 'on') {
            $uArr = [
                'meeting_name' => $name,
                'user_name' => $name,
                'date' => $date
            ];

            SendMsg::SendMsgs($uArr, 'New Zoom Meeting');
        }
    }
}