<?php

namespace Noble\Telegram\Listeners;

use Noble\School\Events\CreateSubject;
use Noble\Telegram\Services\SendMsg;

class CreateSubjectLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateSubject $event)
    {
        $subject = $event->subject;
        if (company_setting('Telegram New Subject')  == 'on') {

            $uArr = [
                'subject_name' => $subject->name,
            ];
            SendMsg::SendMsgs($uArr , 'New Subject');
        }
    }
}
