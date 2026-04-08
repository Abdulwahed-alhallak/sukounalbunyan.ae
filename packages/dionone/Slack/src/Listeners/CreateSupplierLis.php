<?php

namespace DionONE\Slack\Listeners;

use DionONE\CMMS\Events\CreateSupplier;
use DionONE\Slack\Services\SendMsg;

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
