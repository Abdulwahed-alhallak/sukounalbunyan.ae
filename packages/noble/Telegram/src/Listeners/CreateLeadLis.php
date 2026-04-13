<?php

namespace Noble\Telegram\Listeners;

use Noble\Telegram\Services\SendMsg;
use Noble\Lead\Events\CreateLead;


class CreateLeadLis
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
    public function handle(CreateLead $event)
    {
        if (company_setting('Telegram New Lead')  == 'on')
        {
            $uArr = [];
            SendMsg::SendMsgs($uArr , 'New Lead');
        }
    }
}
