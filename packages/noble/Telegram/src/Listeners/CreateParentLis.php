<?php

namespace Noble\Telegram\Listeners;

use Noble\School\Events\CreateParent;
use Noble\Telegram\Services\SendMsg;

class CreateParentLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateParent $event)
    {
        $parent     = $event->parent;
        $parentName = $parent->father_name
            ?? $parent->mother_name
            ?? $parent->guardian_name;
        if (company_setting('Telegram New Parents')  == 'on') {

            if(!empty($parent))
            {
                $uArr = [
                    'parent_name' => $parentName
                ];
                SendMsg::SendMsgs($uArr , 'New Parents');
            }
        }
    }
}
