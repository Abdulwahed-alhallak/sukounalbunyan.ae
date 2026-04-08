<?php

namespace DionONE\Slack\Listeners;

use App\Models\User;
use DionONE\HospitalManagement\Events\CreateHospitalDoctor;
use DionONE\HospitalManagement\Models\HospitalSpecialization;
use DionONE\Slack\Services\SendMsg;

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
        $doctor =  User::find($doctor->user_id);

        if (company_setting('Slack New Doctor') == 'on') {
            $uArr = [
                'doctor_name' => $doctor->name,
                'specialization' => $specialization->name
            ];

            SendMsg::SendMsgs($uArr, 'New Doctor');
        }
    }
}
