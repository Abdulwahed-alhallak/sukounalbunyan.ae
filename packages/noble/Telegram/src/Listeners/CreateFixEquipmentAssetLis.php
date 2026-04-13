<?php

namespace Noble\Telegram\Listeners;

use App\Models\User;
use Noble\FixEquipment\Events\CreateFixEquipmentAsset;
use Noble\FixEquipment\Models\FixEquipmentLocation;
use Noble\Telegram\Services\SendMsg;

class CreateFixEquipmentAssetLis
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
    public function handle(CreateFixEquipmentAsset $event)
    {
        $asset    = $event->fixEquipmentAsset;
        $supplier = $asset->supplier;
        $location = $asset->location;

        if (company_setting('Telegram New Asset')  == 'on') {

            $uArr = [
                'name'          => $asset->title,
                'supplier_name' => $supplier->name,
                'location'      => $location->name
            ];
            SendMsg::SendMsgs($uArr , 'New Asset');

        }
    }
}
