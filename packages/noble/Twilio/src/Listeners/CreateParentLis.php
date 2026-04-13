<?php

namespace Noble\Twilio\Listeners;

use App\Models\User;
use Noble\School\Events\CreateParent;
use Noble\Twilio\Services\SendMsg;

class CreateParentLis
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
    public function handle(CreateParent $event)
    {
        if (company_setting('Twilio New Parents') == 'on') {
            $parent = $event->parent;

            $to   = $parent->father_phone ?: $parent->mother_phone ?: $parent->guardian_phone;
            $name = $parent->father_name ?: $parent->mother_name ?: $parent->guardian_name;

            if (!empty($name) && !empty($to)) {
                $uArr = [
                    'parent_name' => $name
                ];

                SendMsg::SendMsgs($to, $uArr, 'New Parents');
            }
        }
    }
}
