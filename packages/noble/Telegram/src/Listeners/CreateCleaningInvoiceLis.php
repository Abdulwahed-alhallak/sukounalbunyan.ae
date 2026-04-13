<?php

namespace Noble\Telegram\Listeners;

use App\Models\User;
use Noble\CleaningManagement\Events\CreateCleaningInvoice;
use Noble\CleaningManagement\Models\CleaningInspection;
use Noble\Telegram\Services\SendMsg;

class CreateCleaningInvoiceLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateCleaningInvoice $event)
    {
        $invoice    = $event->cleaningInvoice;
        $inspection = CleaningInspection::find($invoice->inspection_id);
        $client     = User::where('id',$inspection->booking->user_id)->select('name')->first();
        $user       = isset($inspection->booking->customer_name) ? $inspection->booking->customer_name : $client['name'] ?? '' ;

        if (company_setting('Telegram New Cleaning Invoice')  == 'on') {

            $uArr = [
                'user_name' => $user
            ];
            SendMsg::SendMsgs($uArr , 'New Cleaning Invoice');
        }
    }
}
