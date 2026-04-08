<?php

namespace DionONE\Slack\Listeners;

use DionONE\FixEquipment\Events\CreateFixEquipmentMaintenance;
use DionONE\FixEquipment\Models\FixEquipmentAsset;
use DionONE\Slack\Services\SendMsg;

class CreateFixEquipmentMaintenanceLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateFixEquipmentMaintenance $event)
    {
        $maintenance = $event->fixEquipmentMaintenance;
        $asset = FixEquipmentAsset::find($maintenance->asset_id);

        if (company_setting('Slack New Maintenance') == 'on') {
            $uArr = [
                'name'  => $maintenance->maintenance_type,
                'asset' => $asset->asset_name,
                'date'  => $maintenance->maintenance_date
            ];

            SendMsg::SendMsgs($uArr, 'New Maintenance');
        }
    }
}