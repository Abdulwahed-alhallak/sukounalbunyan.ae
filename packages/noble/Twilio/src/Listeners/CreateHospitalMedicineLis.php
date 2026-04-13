<?php

namespace Noble\Twilio\Listeners;

use Noble\HospitalManagement\Events\CreateHospitalMedicine;
use Noble\Twilio\Services\SendMsg;

class CreateHospitalMedicineLis
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
    public function handle(CreateHospitalMedicine $event)
    {
        if (company_setting('Twilio New Hospital Medicine') == 'on') {

            $medicine = $event->hospitalMedicine;

            $to = \Auth::user()->mobile_no;

            if (!empty($medicine) && !empty($to)) {
                $uArr = [
                    'name' => $medicine->name
                ];

                SendMsg::SendMsgs($to, $uArr, 'New Hospital Medicine');
            }
        }
    }
}
