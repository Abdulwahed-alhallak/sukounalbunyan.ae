<?php

namespace Noble\Slack\Listeners;

use Noble\School\Events\CreateAdmission;
use Noble\School\Models\SchoolStudentInfo;
use Noble\Slack\Services\SendMsg;

class CreateAdmissionLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateAdmission $event)
    {
        $admission = $event->admission;
        if (company_setting('Slack New Addmissions') == 'on') {
            $student = SchoolStudentInfo::where('admission_id', $admission->id)->first();
            $studentName = $student ? trim($student->first_name . ' ' . $student->last_name) : '';

            $uArr = [
                'student_name' => $studentName
            ];

            SendMsg::SendMsgs($uArr, 'New Addmissions');
        }
    }
}
