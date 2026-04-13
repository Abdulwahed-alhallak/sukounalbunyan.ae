<?php

namespace Noble\Telegram\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Noble\Taskly\Events\CreateTaskComment;
use Noble\Taskly\Models\ProjectTask;
use Noble\Telegram\Services\SendMsg;

class CreateTaskCommentLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateTaskComment $event)
    {
        if(company_setting('Telegram New Task Comment')  == 'on')
        {
            $comment = $event->comment;
            if(!empty($comment))
            {
                $task = ProjectTask::where('id',$comment->task_id)->first();
                $uArr = [
                    'task_name' => $task->title,
                ];
                SendMsg::SendMsgs($uArr , 'New Task Comment');
            }
        }
    }
}
