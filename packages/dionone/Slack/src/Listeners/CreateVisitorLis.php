<?php

namespace DionONE\Slack\Listeners;

use DionONE\Slack\Services\SendMsg;
use DionONE\VisitorManagement\Events\CreateVisitor;

class CreateVisitorLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateVisitor $event)
    {
        $visitor = $event->visitor;

        if (company_setting('Slack New Visitor') == 'on') {
            $uArr = [
                'name' => $visitor->name,
            ];

            SendMsg::SendMsgs($uArr, 'New Visitor');
        }
    }
}