<?php

namespace Noble\Telegram\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Noble\Telegram\Services\SendMsg;
use Noble\ToDo\Events\CreateToDo;

class CreateToDoLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateToDo $event)
    {
        $toDo = $event->todo;

        if (company_setting('Telegram New To Do')  == 'on') {

            $uArr = [
                'name' => $toDo->title,
                'module' => $toDo->sub_module
            ];
            SendMsg::SendMsgs($uArr , 'New To Do');
        }
    }
}
