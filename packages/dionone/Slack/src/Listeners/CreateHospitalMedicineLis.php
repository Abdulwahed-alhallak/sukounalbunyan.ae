<?php

namespace DionONE\Slack\Listeners;

use DionONE\HospitalManagement\Events\CreateHospitalMedicine;
use DionONE\Slack\Services\SendMsg;

class CreateHospitalMedicineLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateHospitalMedicine $event)
    {
        $medicine = $event->hospitalMedicine;

        if (company_setting('Slack New Hospital Medicine') == 'on') {
            $uArr = [
                'name' => $medicine->name
            ];

            SendMsg::SendMsgs($uArr, 'New Hospital Medicine');
        }
    }
}