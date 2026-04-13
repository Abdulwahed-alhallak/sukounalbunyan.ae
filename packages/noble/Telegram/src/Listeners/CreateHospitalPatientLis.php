<?php

namespace Noble\Telegram\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Noble\HospitalManagement\Events\CreateHospitalPatient;
use Noble\Telegram\Services\SendMsg;

class CreateHospitalPatientLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateHospitalPatient $event)
    {
        $patient = $event->hospitalpatient;
        if (company_setting('Telegram New Patient')  == 'on') {

            if(!empty($patient))
            {
                $uArr = [
                    'patient_name' => $patient->name
                ];
                SendMsg::SendMsgs($uArr , 'New Patient');
            }
        }
    }
}
