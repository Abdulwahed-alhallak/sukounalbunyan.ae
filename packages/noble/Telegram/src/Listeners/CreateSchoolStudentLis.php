<?php

namespace Noble\Telegram\Listeners;

use Noble\School\Events\CreateStudent;
use Noble\Telegram\Services\SendMsg;

class CreateSchoolStudentLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateStudent $event)
    {
        $student = $event->student;
        $class   = $student->class;
        if (company_setting('Telegram New Students')  == 'on') {

            if(!empty($student) && !empty($class))
            {
                $uArr = [
                    'student_name' => $student->user->name,
                    'class_name'   => $class->name
                ];
                SendMsg::SendMsgs($uArr , 'New Students');
            }
        }
    }
}
