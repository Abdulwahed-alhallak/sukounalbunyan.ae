<?php

namespace Noble\Twilio\Listeners;

use App\Models\User;
use Noble\Account\Events\CreateCustomer;
use Noble\Twilio\Services\SendMsg;

class CreateCustomerLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateCustomer $event)
    {
        if (company_setting('Twilio New Customer') == 'on') {

            $user = User::find($event->customer->user_id);

            if (!empty($user->mobile_no)) {
                $uArr = [];

                SendMsg::SendMsgs($user->mobile_no, $uArr, 'New Customer');
            }
        }
    }
}
