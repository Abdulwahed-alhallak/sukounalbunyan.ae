<?php

namespace Noble\Twilio\Listeners;

use App\Models\User;
use Noble\Timesheet\Events\CreateTimesheet;
use Noble\Twilio\Services\SendMsg;

class CreateTimesheetLis
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
    public function handle(CreateTimesheet $event)
    {
        if (company_setting('Twilio New Timesheet') == 'on') {

            $timesheet = $event->timesheet;
            $user      = User::find($timesheet->created_by);

            if (!empty($timesheet) && !empty($user) && !empty($user->mobile_no)) {
                $uArr = [
                    'user_name' => $user->name,
                    'type'      => $timesheet->type,
                ];

                SendMsg::SendMsgs($user->mobile_no, $uArr, 'New Timesheet');
            }
        }
    }
}
