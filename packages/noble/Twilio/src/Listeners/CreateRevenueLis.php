<?php

namespace Noble\Twilio\Listeners;

use App\Models\User;
use Noble\Account\Events\CreateRevenue;
use Noble\Twilio\Services\SendMsg;

class CreateRevenueLis
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
    public function handle(CreateRevenue $event)
    {
        if (company_setting('Twilio New Revenue') == 'on') {
            $request    = $event->request;
            $AssignUser = \Auth::user();

            if (!empty($AssignUser->mobile_no)) {
                $uArr = [
                    'amount'    => $request->amount,
                    'user_name' => $AssignUser->name,
                ];

                SendMsg::SendMsgs($AssignUser->mobile_no, $uArr, 'New Revenue');
            }
        }
    }
}
