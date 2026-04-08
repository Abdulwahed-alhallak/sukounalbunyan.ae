<?php

namespace DionONE\Telegram\Listeners;

use DionONE\School\Events\CreateEmployee;
use DionONE\Telegram\Services\SendMsg;

class CreateSchoolEmployeeLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateEmployee $event)
    {
        $employee = $event->employee;
        if (company_setting('Telegram New Teacher')  == 'on') {

            if(!empty($employee))
            {
                $uArr = [
                    'teacher_name' => $employee->user->name
                ];
                SendMsg::SendMsgs($uArr , 'New Teacher');
            }
        }
    }
}
