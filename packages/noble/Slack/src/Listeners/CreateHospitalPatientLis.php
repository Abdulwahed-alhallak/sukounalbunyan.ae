<?php

namespace Noble\Slack\Listeners;

use Noble\HospitalManagement\Events\CreateHospitalPatient;
use Noble\Slack\Services\SendMsg;

class CreateHospitalPatientLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateHospitalPatient $event)
    {
        $patient = $event->hospitalpatient;

        if (company_setting('Slack New Patient') == 'on') {
            $uArr = [
                'patient_name' => $patient->name
            ];
            SendMsg::SendMsgs($uArr, 'New Patient');
        }
    }
}