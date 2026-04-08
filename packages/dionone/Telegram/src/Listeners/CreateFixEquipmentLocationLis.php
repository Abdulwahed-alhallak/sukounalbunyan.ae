<?php

namespace DionONE\Telegram\Listeners;

use DionONE\FixEquipment\Events\CreateFixEquipmentLocation;
use DionONE\Telegram\Services\SendMsg;

class CreateFixEquipmentLocationLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateFixEquipmentLocation $event)
    {
        $location = $event->fixEquipmentLocation;

        if (company_setting('Telegram New Fix Equipment Location')  == 'on') {

            $uArr = [
                'location_name' => $location->name
            ];

            SendMsg::SendMsgs($uArr , 'New Fix Equipment Location');
        }
    }
}
