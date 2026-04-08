<?php

namespace DionONE\Slack\Listeners;

use DionONE\School\Events\CreateClassTimetable;
use DionONE\School\Models\SchoolClass;
use DionONE\Slack\Services\SendMsg;

class CreateClassTimetableLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateClassTimetable $event)
    {
        $timetable = $event->timetable;
        $class = SchoolClass::find($timetable->class_id);

        if (company_setting('Slack New Time Table') == 'on') {
            $uArr = [
                'class_name' => $class->name
            ];

            SendMsg::SendMsgs($uArr, 'New Time Table');
        }
    }
}