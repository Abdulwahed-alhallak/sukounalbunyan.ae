<?php

namespace Noble\Slack\Listeners;

use Noble\Appointment\Events\CreateAppointment;
use Noble\Slack\Services\SendMsg;

class CreateAppointmentLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateAppointment $event)
    {
        $request = $event->request;
        $appointment = $event->appointment;

        if (company_setting('Slack New Appointment') == 'on') {
            $uArr = [
                'appointment_name' => $request->name,
                'date' => $request->date,
                'time' => $request->time,
            ];
            SendMsg::SendMsgs($uArr, 'New Appointment', $appointment->created_by);
        }
    }
}

