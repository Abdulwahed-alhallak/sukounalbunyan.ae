<?php

namespace Noble\Twilio\Listeners;

use Noble\HospitalManagement\Events\CreateHospitalAppointment;
use Noble\HospitalManagement\Models\HospitalDoctor;
use Noble\HospitalManagement\Models\HospitalPatient;
use Noble\Twilio\Services\SendMsg;

class CreateHospitalAppointmentLis
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
    public function handle(CreateHospitalAppointment $event)
    {
        if (company_setting('Twilio New Hospital Appointment') == 'on') {

            $hospitalappointment = $event->hospitalappointment;

            $patient = HospitalPatient::find($hospitalappointment->patient_id);
            $doctor  = HospitalDoctor::with('user')->find($hospitalappointment->doctor_id);

            if (!empty($patient) && !empty($doctor)) {
                $phones = array_filter([
                    $patient->mobile_no ?? null,
                    $doctor->user->mobile_no ?? null,
                ]);

                $phones = array_unique($phones);

                foreach ($phones as $phone) {
                    $uArr = [
                        'patient_name' => $patient->name,
                        'doctor_name'  => $doctor->user->name,
                    ];

                    SendMsg::SendMsgs($phone, $uArr, 'New Hospital Appointment');
                }
            }
        }
    }
}
