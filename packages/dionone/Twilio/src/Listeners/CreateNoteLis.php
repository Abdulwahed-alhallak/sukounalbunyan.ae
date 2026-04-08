<?php

namespace DionONE\Twilio\Listeners;

use App\Models\User;
use DionONE\Notes\Events\CreateNote;
use DionONE\Twilio\Services\SendMsg;

class CreateNoteLis
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
    public function handle(CreateNote $event)
    {
        if (company_setting('Twilio New Note') == 'on') {

            $note  = $event->note;
            $users = User::whereIn('id', $note->assigned_users)->get();

            foreach ($users as $user) {
                if (!empty($user->mobile_no)) {
                    $uArr = [
                        'note_type' => $note->type == '1' ? 'shared' : 'personal',
                        'user_name' => $user->name
                    ];

                    SendMsg::SendMsgs($user->mobile_no, $uArr, 'New Note');
                }
            }
        }
    }
}
