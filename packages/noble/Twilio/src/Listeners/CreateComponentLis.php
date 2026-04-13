<?php

namespace Noble\Twilio\Listeners;

use Noble\CMMS\Events\CreateComponent;
use Noble\Twilio\Services\SendMsg;

class CreateComponentLis
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
    public function handle(CreateComponent $event)
    {
        if (company_setting('Twilio New Component') == 'on') {

            $request   = $event->request;
            $component = $request->name;
            $to        = \Auth::user()->mobile_no;

            if (!empty($component) && !empty($to)) {
                $uArr = [
                    'component_name' => $component,
                ];

                SendMsg::SendMsgs($to, $uArr, 'New Component');
            }
        }
    }
}
