<?php

namespace DionONE\Telegram\Listeners;

use DionONE\Appointment\Events\CreateSchedule;
use DionONE\Telegram\Services\SendMsg;


class CreateScheduleLis
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
    public function handle(CreateSchedule $event)
    {
        $schedule   = $event->schedule;
        if(company_setting('Telegram New Appointment', $schedule->created_by) == 'on')
        {
            $request = $event->request;
            if(!empty($schedule) && !empty($schedule->id))
            {
                $uArr = [
                    'appointment_name' => $schedule->name,
                    'date'             => $request->date,
                    'time'             => $request->start_time,
                    'business_name'    => $schedule->appointment->appointment_name
                ];
                SendMsg::SendMsgs($uArr,'New Appointment' , $schedule->created_by);
            }
        }
    }
}
