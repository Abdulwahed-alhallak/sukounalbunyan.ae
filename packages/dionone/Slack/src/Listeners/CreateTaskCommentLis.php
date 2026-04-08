<?php

namespace DionONE\Slack\Listeners;

use DionONE\Slack\Services\SendMsg;
use DionONE\Taskly\Events\CreateTaskComment;
use DionONE\Taskly\Models\ProjectTask;

class CreateTaskCommentLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateTaskComment $event)
    {
        $comment = $event->comment;

        if (company_setting('Slack New Task Comment') == 'on') {
            $task = ProjectTask::where('id',$comment->task_id)->first();

                $uArr = [
                    'task_name' => $task->title,
                ];

            SendMsg::SendMsgs($uArr, 'New Task Comment');
        }
    }
}