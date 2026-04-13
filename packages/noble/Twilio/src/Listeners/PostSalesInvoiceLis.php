<?php

namespace Noble\Twilio\Listeners;

use Noble\Twilio\Services\SendMsg;

class PostSalesInvoiceLis
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        if (company_setting('Twilio Sales Invoice Status Updated') == 'on') {

            $to = \Auth::user()->mobile_no;

            if (!empty($to)) {
                $uArr = [];

                SendMsg::SendMsgs($to, $uArr, 'Sales Invoice Status Updated');
            }
        }
    }
}
