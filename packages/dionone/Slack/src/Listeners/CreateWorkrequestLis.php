<?php

namespace DionONE\Slack\Listeners;

use DionONE\CMMS\Events\CreateWorkrequest;
use DionONE\Slack\Services\SendMsg;
use DionONE\CMMS\Models\CmmsComponent;

class CreateWorkrequestLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateWorkrequest $event)
    {
        $request = $event->request;
        $user = $request->user_name;

        if (company_setting('Slack Work Order Request', $event->workOrder->created_by) == 'on') {
            $component = CmmsComponent::find($request->components_id);

            $uArr = [
                'component_name' => $component->name,
                'user_name' => $user,
            ];
            
            SendMsg::SendMsgs($uArr, 'Work Order Request', $component->created_by);
        }
    }
}
