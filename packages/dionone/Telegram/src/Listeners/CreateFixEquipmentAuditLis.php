<?php

namespace DionONE\Telegram\Listeners;

use DionONE\FixEquipment\Events\CreateFixEquipmentAudit;
use DionONE\FixEquipment\Models\FixEquipmentAsset;
use DionONE\Telegram\Services\SendMsg;
use DionONE\FixEquipment\Models\FixEquipmentAudit;

class CreateFixEquipmentAuditLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateFixEquipmentAudit $event)
    {
        $audit = $event->fixEquipmentAudit;
        $assetIds = is_array($audit->asset_ids)
        ? $audit->asset_ids
        : explode(',', $audit->asset_ids);
        $asset = FixEquipmentAsset::whereIn('id', $assetIds)->pluck('asset_name')->toArray();
        $assets = implode(',', $asset);

        if (company_setting('Telegram New Audit')  == 'on') {

            $uArr = [
                'name' => $audit->title,
                'assets' => $assets
            ];
            SendMsg::SendMsgs($uArr , 'New Audit');
        }
    }
}
