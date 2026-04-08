<?php

namespace DionONE\Slack\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use DionONE\CMMS\Events\CreateLocation;
use DionONE\Slack\Services\SendMsg;

class CreateLocationLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateLocation $event)
    {
        $request = $event->request;
        $location = $request->name;

        if (company_setting('Slack New Location') == 'on') {
            $uArr = [
                'location_name' => $location,
            ];

            SendMsg::SendMsgs($uArr, 'New Location');
        }
    }
}
