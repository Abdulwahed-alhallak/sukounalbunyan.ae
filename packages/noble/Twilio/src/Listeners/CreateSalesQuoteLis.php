<?php

namespace Noble\Twilio\Listeners;

use App\Models\User;
use Noble\Sales\Events\CreateSalesQuote;
use Noble\Twilio\Services\SendMsg;

class CreateSalesQuoteLis
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
    public function handle(CreateSalesQuote $event)
    {
        if (company_setting('Twilio New Quote') == 'on') {

            $quote = $event->quote;

            $AssignUser = User::find($quote->assign_user_id);
            $to         = $AssignUser->mobile_no;

            if (!empty($to)) {
                $uArr = [
                    'quotation_id' => $quote->quote_number
                ];

                SendMsg::SendMsgs($to, $uArr, 'New Quote');
            }
        }
    }
}
