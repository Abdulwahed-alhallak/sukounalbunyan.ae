<?php

namespace DionONE\Telegram\Listeners;

use DionONE\Telegram\Services\SendMsg;
use DionONE\Sales\Events\CreateSalesQuote;


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
        if(company_setting('Telegram New Quote')  == 'on')
        {
            $quote = $event->quote;
            if(!empty($quote))
            {
                $uArr = [
                    'quotation_id' => $quote->quote_number
                ];
                SendMsg::SendMsgs($uArr , 'New Quote');
            }
        }
    }
}
