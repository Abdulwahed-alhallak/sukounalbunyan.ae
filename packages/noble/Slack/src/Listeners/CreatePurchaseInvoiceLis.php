<?php

namespace Noble\Slack\Listeners;

use App\Events\CreatePurchaseInvoice;
use Noble\Slack\Services\SendMsg;

class CreatePurchaseInvoiceLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreatePurchaseInvoice $event)
    {
        $purchase = $event->purchaseInvoice;

        if (company_setting('Slack New Purchase') == 'on') {
            $uArr = [
                 'purchase_id' => $purchase->invoice_number,
            ];
            
            SendMsg::SendMsgs($uArr, 'New Purchase');
        }
    }
}