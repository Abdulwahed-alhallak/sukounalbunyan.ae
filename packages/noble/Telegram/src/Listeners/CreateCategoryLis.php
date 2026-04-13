<?php

namespace Noble\Telegram\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Noble\InnovationCenter\Events\CreateCategory;
use Noble\Telegram\Services\SendMsg;

class CreateCategoryLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateCategory $event)
    {
        $CreativityCategories = $event->category;

        if (company_setting('Telegram New Category') == 'on') {

            $uArr = [
                'name'=> $CreativityCategories->name
            ];
            SendMsg::SendMsgs($uArr , 'New Category');
        }
    }
}
