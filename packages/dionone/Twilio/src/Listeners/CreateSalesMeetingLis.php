<?php

namespace DionONE\Twilio\Listeners;

use App\Models\User;
use DionONE\Sales\Events\CreateSalesMeeting;
use DionONE\Twilio\Services\SendMsg;

class CreateSalesMeetingLis
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
    public function handle(CreateSalesMeeting $event)
    {
        if (company_setting('Twilio Meeting Assigned') == 'on') {
            $request = $event->request;

            $AssignUser = User::find($request->assigned_user_id);
            $to         = $AssignUser->mobile_no;

            if (!empty($to)) {
                $uArr = [
                    'meeting_name' => $request->name
                ];

                SendMsg::SendMsgs($to, $uArr, 'Meeting Assigned');
            }
        }
    }
}
