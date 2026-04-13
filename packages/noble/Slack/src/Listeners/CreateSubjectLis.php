<?php

namespace Noble\Slack\Listeners;

use Noble\School\Events\CreateSubject;
use Noble\School\Models\SchoolClass;
use Noble\Slack\Services\SendMsg;

class CreateSubjectLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateSubject $event)
    {
        $subject = $event->subject;
        
        if (company_setting('Slack New Subject') == 'on') {
            $uArr = [
                'subject_name' => $subject->name,
            ];

            SendMsg::SendMsgs($uArr, 'New Subject');
        }
    }
}