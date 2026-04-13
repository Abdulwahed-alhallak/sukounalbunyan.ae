<?php

namespace Noble\Twilio\Listeners;

use App\Models\User;
use Noble\FixEquipment\Events\CreateFixEquipmentConsumable;
use Noble\FixEquipment\Models\FixEquipmentAsset;
use Noble\Twilio\Services\SendMsg;

class CreateFixEquipmentConsumableLis
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
    public function handle(CreateFixEquipmentConsumable $event)
    {
        if (company_setting('Twilio New Consumables') == 'on') {

            $consumables = $event->fixEquipmentConsumable;

            $asset = FixEquipmentAsset::find($consumables->asset_id);
            $user  = User::find($consumables->created_by);

            if (!empty($user->mobile_no)) {
                $uArr = [
                    'name'   => $consumables->title,
                    'assets' => $asset->asset_name
                ];

                SendMsg::SendMsgs($user->mobile_no, $uArr, 'New Consumables');
            }
        }
    }
}
