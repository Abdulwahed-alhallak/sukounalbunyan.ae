<?php

namespace Noble\Twilio\Listeners;

use App\Models\User;
use Noble\ZoomMeeting\Events\CreateZoomMeeting;
use Noble\Twilio\Services\SendMsg;

class CreateZoomMeetingLis
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(CreateZoomMeeting $event)
    {
        if (company_setting('Twilio New Zoom Meeting') == 'on') {

            $meeting   = $event->meeting;
            $request   = $event->request;
            $user_name = \Auth::user()->name;

            $users = User::whereIN('id', $request->participants)->get();

            foreach ($users as $user) {
                if (!empty($user->mobile_no)) {
                    $uArr = [
                        'meeting_name' => $meeting->title,
                        'user_name'    => $user_name,
                        'date'         => $meeting->start_time
                    ];

                    SendMsg::SendMsgs($user->mobile_no, $uArr, 'New Zoom Meeting');
                }
            }
        }
    }
}
