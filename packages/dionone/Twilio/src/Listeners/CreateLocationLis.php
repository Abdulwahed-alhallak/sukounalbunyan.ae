<?php

namespace DionONE\Twilio\Listeners;

use DionONE\CMMS\Events\CreateLocation;
use DionONE\Twilio\Services\SendMsg;

class CreateLocationLis
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
    public function handle(CreateLocation $event)
    {
        if (company_setting('Twilio New Location') == 'on') {

            $request  = $event->request;
            $location = $request->name;
            $to       = \Auth::user()->mobile_no;

            if (!empty($location) && !empty($to)) {
                $uArr = [
                    'location_name' => $location,
                ];

                SendMsg::SendMsgs($to, $uArr, 'New Location');
            }
        }
    }
}
