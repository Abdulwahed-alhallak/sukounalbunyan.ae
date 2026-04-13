<?php

namespace Noble\Twilio\Listeners;

use Illuminate\Support\Facades\Auth;
use Noble\Taskly\Events\CreateProjectMilestone;
use Noble\Twilio\Services\SendMsg;

class CreateProjectMilestoneLis
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
    public function handle(CreateProjectMilestone $event)
    {
        if (company_setting('Twilio New Milestone') == 'on') {

            $to = Auth::user()->mobile_no;
            if (!empty($to)) {
                $uArr = [];

                SendMsg::SendMsgs($to, $uArr, 'New Milestone');
            }
        }
    }
}
