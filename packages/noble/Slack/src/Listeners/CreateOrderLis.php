<?php

namespace Noble\Slack\Listeners;

use Noble\LMS\Events\CreateOrder;
use Noble\LMS\Models\LMSStudent;
use Noble\Slack\Services\SendMsg;

class CreateOrderLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateOrder $event)
    {
        if (company_setting('Slack New Course Order') == 'on') {
            $order = $event->order;
            $student = LMSStudent::where('id', $order->student_id)->first();

            $uArr = [
                'student_name' => $student->name,
            ];

            SendMsg::SendMsgs($uArr, 'New Course Order');
        }
    }
}
