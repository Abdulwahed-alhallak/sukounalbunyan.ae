<?php

namespace Noble\Slack\Listeners;

use Noble\School\Events\CreateStudent;
use Noble\School\Models\SchoolClass;
use Noble\School\Models\SchoolStudentInfo;
use Noble\Slack\Services\SendMsg;

class CreateStudentLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateStudent $event)
    {
        $student = $event->student;
        $class = SchoolClass::find($student->class_id);
        $student = SchoolStudentInfo::where('admission_id', $student->admission_id)->first();
        $studentName = $student ? trim($student->first_name . ' ' . $student->last_name) : '';

        if (company_setting('Slack New Students') == 'on') {
            $uArr = [
                'student_name' => $studentName,
                    'class_name' => $class->name
            ];

            SendMsg::SendMsgs($uArr, 'New Students');
        }
    }
}