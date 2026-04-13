<?php

namespace Noble\Telegram\Listeners;

use Noble\School\Events\CreateClassTimetable;
use Noble\School\Models\SchoolClass;
use Noble\Telegram\Services\SendMsg;

class CreateClassTimetableLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateClassTimetable $event)
    {
        $timetable = $event->timetable;
        $class     = SchoolClass::find($timetable->class_id);

        if (company_setting('Telegram New Time Table')  == 'on') {

            if(!empty($class))
            {
                $uArr = [
                    'class_name' => $class->name
                ];
                SendMsg::SendMsgs($uArr , 'New Time Table');
            }
        }
    }
}
