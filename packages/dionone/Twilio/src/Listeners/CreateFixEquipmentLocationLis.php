<?php

namespace DionONE\Twilio\Listeners;

use App\Models\User;
use DionONE\FixEquipment\Events\CreateFixEquipmentLocation;
use DionONE\Twilio\Services\SendMsg;

class CreateFixEquipmentLocationLis
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
    public function handle(CreateFixEquipmentLocation $event)
    {
        if (company_setting('Twilio New Fix Equipment Location') == 'on') {

            $location = $event->fixequipmentlocation;

            $user = User::find($location->created_by);

            if (!empty($user->mobile_no)) {
                $uArr = [
                    'location_name' => $location->name
                ];

                SendMsg::SendMsgs($user->mobile_no, $uArr, 'New Fix Equipment Location');
            }
        }
    }
}
