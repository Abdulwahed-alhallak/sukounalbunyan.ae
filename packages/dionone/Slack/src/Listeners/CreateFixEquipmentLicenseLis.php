<?php

namespace DionONE\Slack\Listeners;

use DionONE\FixEquipment\Events\CreateFixEquipmentLicense;
use DionONE\FixEquipment\Models\FixEquipmentAsset;
use DionONE\Slack\Services\SendMsg;

class CreateFixEquipmentLicenseLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateFixEquipmentLicense $event)
    {
        $license = $event->fixEquipmentLicense;
        $asset = FixEquipmentAsset::find($license->asset_id);

        if (company_setting('Slack New Licence') == 'on') {
            $uArr = [
                'name' => $license->title,
                'assets' => $asset->asset_name
            ];

            SendMsg::SendMsgs($uArr, 'New Licence');
        }
    }
}