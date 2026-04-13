<?php

namespace Noble\Twilio\Listeners;

use App\Models\User;
use Noble\Feedback\Events\CreateHistory;
use Noble\Feedback\Models\TemplateModule;
use Noble\Twilio\Services\SendMsg;

class CreateHistoryLis
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
    public function handle(CreateHistory $event)
    {
        $history = $event->history;

        if (company_setting('Twilio New Feedback Rating', $history->created_by) == 'on') {
            $module = TemplateModule::find($history->module_id);

            $user     = (json_decode($history->content));
            $authUser = User::find($history->created_by);

            if (!empty($module) && !empty($user) && !empty($authUser->mobile_no)) {
                $uArr = [
                    'module_name' => $module->submodule,
                    'user_name'   => $user->name
                ];

                SendMsg::SendMsgs($authUser->mobile_no, $uArr, 'New Feedback Rating', $history->created_by);
            }
        }
    }
}
