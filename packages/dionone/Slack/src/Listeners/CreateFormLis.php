<?php

namespace DionONE\Slack\Listeners;

use DionONE\FormBuilder\Events\CreateForm;
use DionONE\Slack\Services\SendMsg;

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