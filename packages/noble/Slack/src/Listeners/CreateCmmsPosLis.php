<?php

namespace Noble\Slack\Listeners;

use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Noble\CMMS\Events\CreateCmmsPos;
use Noble\Slack\Services\SendMsg;

class CreateCmmsPosLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateCmmsPos $event)
    {
        $request = $event->request;
        $user = User::find($request->user_id);

        if (company_setting('Slack New POs') == 'on') {
            $uArr = [
                'user_name' => $user->name,
            ];

            SendMsg::SendMsgs($uArr, 'New POs');
        }
    }
}
