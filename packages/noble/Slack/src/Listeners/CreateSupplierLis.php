<?php

namespace Noble\Slack\Listeners;

use Noble\CMMS\Events\CreateSupplier;
use Noble\Slack\Services\SendMsg;

class CreateSupplierLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateSupplier $event)
    {
        $request = $event->request;
        $user = $request->name;
        
        if (company_setting('Slack New Supplier') == 'on') {
            $uArr = [
                'user_name' => $user,
            ];

            SendMsg::SendMsgs($uArr, 'New Supplier');
        }
    }
}
