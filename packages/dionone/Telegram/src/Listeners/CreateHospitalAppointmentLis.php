<?php

namespace DionONE\Telegram\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use DionONE\HospitalManagement\Events\CreateHospitalAppointment;
use DionONE\HospitalManagement\Models\HospitalDoctor;
use DionONE\HospitalManagement\Models\HospitalPatient;
use DionONE\Telegram\Services\SendMsg;

class CreateHospitalAppointmentLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateHospitalAppointment $event)
    {
        $hospitalappointment = $event->hospitalappointment;
        $patient = HospitalPatient::find($hospitalappointment->patient_id);
        $doctor  = HospitalDoctor::find($hospitalappointment->doctor_id);

        if (company_setting('Telegram New Hospital Appointment')  == 'on') {

            if(!empty($patient) && !empty($doctor))
            {
                $uArr = [
                    'patient_name' => $patient->name,
                    'doctor_name'  => $doctor->name
                ];
                SendMsg::SendMsgs($uArr , 'New Hospital Appointment');
            }
        }
    }
}
