<?php

namespace DionONE\Slack\Listeners;

use DionONE\School\Events\CreateSubject;
use DionONE\School\Models\SchoolClass;
use DionONE\Slack\Services\SendMsg;

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