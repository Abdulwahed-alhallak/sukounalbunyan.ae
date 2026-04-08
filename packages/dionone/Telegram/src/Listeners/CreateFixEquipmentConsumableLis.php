<?php

namespace DionONE\Telegram\Listeners;

use DionONE\FixEquipment\Events\CreateFixEquipmentConsumable;
use DionONE\FixEquipment\Models\FixEquipmentAsset;
use DionONE\Telegram\Services\SendMsg;

class CreateFixEquipmentConsumableLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateFixEquipmentConsumable $event)
    {
        $consumables = $event->fixEquipmentConsumable;
        $asset = FixEquipmentAsset::find($consumables->asset_id);

        if (company_setting('Telegram New Consumables')  == 'on') {

            $uArr = [
                'name'   => $consumables->title,
                'assets' => $asset->asset_name
            ];
            SendMsg::SendMsgs($uArr , 'New Consumables');

        }
    }
}
