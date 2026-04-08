<?php

namespace DionONE\Slack\Listeners;

use DionONE\School\Events\CreateAdmission;
use DionONE\School\Models\SchoolStudentInfo;
use DionONE\Slack\Services\SendMsg;

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
