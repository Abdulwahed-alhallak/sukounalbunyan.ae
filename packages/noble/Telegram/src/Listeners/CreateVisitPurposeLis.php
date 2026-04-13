<?php

namespace Noble\Telegram\Listeners;

use Noble\Telegram\Services\SendMsg;
use Noble\VisitorManagement\Events\CreateVisitPurpose;

class CreateVisitPurposeLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateVisitPurpose $event)
    {
        $visitorReason = $event->visitpurpose;

        if (company_setting('Telegram New Visit Purposes')  == 'on') {

            $uArr = [
                'name' => $visitorReason->name
            ];
            SendMsg::SendMsgs($uArr , 'New Visit Purposes');
        }
    }
}
