<?php

namespace Noble\Twilio\Listeners;

use App\Models\User;
use Noble\InnovationCenter\Events\CreateCategory;
use Noble\Twilio\Services\SendMsg;

class CreateCategoryLis
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
    public function handle(CreateCategory $event)
    {
        if (company_setting('Twilio New Category') == 'on') {

            $CreativityCategories = $event->category;

            $user = User::find($CreativityCategories->created_by);

            if (!empty($user->mobile_no)) {
                $uArr = [
                    'name' => $CreativityCategories->name
                ];

                SendMsg::SendMsgs($user->mobile_no, $uArr, 'New Category');
            }
        }
    }
}
