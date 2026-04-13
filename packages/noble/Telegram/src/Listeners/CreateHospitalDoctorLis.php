<?php

namespace Noble\Telegram\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Noble\HospitalManagement\Events\CreateHospitalDoctor;
use Noble\HospitalManagement\Models\HospitalSpecialization;
use Noble\Telegram\Services\SendMsg;

class CreateHospitalDoctorLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateHospitalDoctor $event)
    {
        $doctor = $event->hospitaldoctor;
        $specialization = HospitalSpecialization::find($doctor->hospital_specialization_id);
        if (company_setting('Telegram New Doctor')  == 'on') {

            if(!empty($specialization))
            {
                $uArr = [
                    'doctor_name'    => $doctor->user->name,
                    'specialization' => $specialization->name
                ];
                SendMsg::SendMsgs($uArr , 'New Doctor');
            }
        }
    }
}
