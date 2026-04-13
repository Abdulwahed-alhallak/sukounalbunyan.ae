<?php

namespace Noble\Slack\Listeners;

use App\Models\User;
use Noble\Sales\Events\CreateSalesOrder;
use Noble\Slack\Services\SendMsg;

class CreateSalesOrderLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateSalesOrder $event)
    {
        $salesorder = $event->salesOrder;

        if (company_setting('Slack New Sales Order') == 'on') {
            $uArr = [
                'sales_order_id' => $salesorder->quote_number
            ];

            SendMsg::SendMsgs($uArr, 'New Sales Order');
        }
    }
}
