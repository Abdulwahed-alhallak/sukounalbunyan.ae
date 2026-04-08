<?php

namespace DionONE\Slack\Listeners;

use DionONE\School\Events\CreateHomework;
use DionONE\School\Models\SchoolClass;
use DionONE\School\Models\SchoolSubject;
use DionONE\Slack\Services\SendMsg;

class CreateHomeworkLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateHomework $event)
    {
        $homework = $event->homework;
        $class = SchoolClass::find($homework->class_id);
        $subject = SchoolSubject::find($homework->subject_id);
        if (company_setting('Slack New Homework') == 'on') {
            $uArr = [
                'homework_title' => $homework->title,
                'class_name' => $class->name,
                'subject_name' => $subject->name
            ];

            SendMsg::SendMsgs($uArr, 'New Homework');
        }
    }
}
