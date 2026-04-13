<?php

namespace Noble\Telegram\Listeners;

use App\Events\CreateWarehouse;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Noble\Telegram\Services\SendMsg;

class CreateWarehouseLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateWarehouse $event)
    {
        $warehouse = $event->warehouse;

        if(company_setting('Telegram New Warehouse')  == 'on')
        {
            if(!empty($warehouse))
            {
                $uArr = [
                    'warehouse_name' => $warehouse->name,
                ];

                SendMsg::SendMsgs($uArr, 'New Warehouse');
            }
        }
    }
}
