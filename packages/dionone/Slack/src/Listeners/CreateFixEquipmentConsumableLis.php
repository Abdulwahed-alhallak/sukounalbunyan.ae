<?php

namespace DionONE\Slack\Listeners;

use DionONE\FixEquipment\Events\CreateFixEquipmentConsumable;
use DionONE\FixEquipment\Models\FixEquipmentAsset;
use DionONE\Slack\Services\SendMsg;

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

        if (company_setting('Slack New Consumables') == 'on') {
            $uArr = [
                'name' => $consumables->title,
                'assets' => $asset->asset_name
            ];

            SendMsg::SendMsgs($uArr, 'New Consumables');
        }
    }
}