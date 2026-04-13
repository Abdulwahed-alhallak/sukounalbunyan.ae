<?php

namespace Noble\Twilio\Listeners;

use Noble\Appointment\Events\AppointmentStatus;
use Noble\Twilio\Services\SendMsg;

class AppointmentStatusLis
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
    public function handle(AppointmentStatus $event)
    {
        if (company_setting('Twilio Appointment Status') == 'on') {
            
            $schedule = $event->schedule;

            if (!empty($schedule->phone)) {
                $uArr = [
                    'appointment_name' => $schedule->appointment->appointment_name,
                    'status'           => $schedule->status,
                ];

                SendMsg::SendMsgs($schedule->phone, $uArr, 'Appointment Status');
            }
        }
    }
}
