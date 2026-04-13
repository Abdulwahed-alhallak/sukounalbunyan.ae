<?php

namespace Noble\Slack\Listeners;

use Noble\FormBuilder\Events\CreateForm;
use Noble\Slack\Services\SendMsg;

class CreateFormLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateForm $event)
    {
        if (company_setting('Slack New Form') == 'on') {
            $form = $event->form;

            $uArr = [
               'name' => $form->name
            ];

            SendMsg::SendMsgs($uArr, 'New Form');
        }
    }
}