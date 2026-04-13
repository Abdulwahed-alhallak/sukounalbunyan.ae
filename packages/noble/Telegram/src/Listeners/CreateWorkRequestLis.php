<?php

namespace Noble\Telegram\Listeners;

use Noble\Telegram\Services\SendMsg;
use Noble\CMMS\Events\CreateWorkRequest;
use Noble\CMMS\Models\CmmsComponent;

class CreateWorkRequestLis
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(CreateWorkRequest $event)
    {
        if(company_setting('Telegram Work Order Request', $event->workOrder->created_by)  == 'on')
        {
            $request   = $event->request;
            $user      = $request->user_name;
            $component = CmmsComponent::find($request->components_id);

            if(!empty($component)){
                $uArr = [
                    'component_name' => $component->name,
                    'user_name' => $user,
                ];

                SendMsg::SendMsgs($uArr , 'Work Order Request', $component->created_by);
            }
        }
    }
}
