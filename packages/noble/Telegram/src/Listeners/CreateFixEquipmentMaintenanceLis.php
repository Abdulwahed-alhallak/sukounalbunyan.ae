<?php

namespace Noble\Telegram\Listeners;

use Noble\FixEquipment\Events\CreateFixEquipmentMaintenance;
use Noble\FixEquipment\Models\FixEquipmentAsset;
use Noble\Telegram\Services\SendMsg;

class CreateFixEquipmentMaintenanceLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateFixEquipmentMaintenance $event)
    {
        $maintenance = $event->fixEquipmentMaintenance;
        $asset       = FixEquipmentAsset::find($maintenance->asset_id);

        if (company_setting('Telegram New Maintenance')  == 'on') {

            $uArr = [
                'name'   => $maintenance->maintenance_type,
                'assets' => $asset->asset_name,
                'date'   => $maintenance->maintenance_date
            ];
            SendMsg::SendMsgs($uArr , 'New Maintenance');
        }
    }
}
