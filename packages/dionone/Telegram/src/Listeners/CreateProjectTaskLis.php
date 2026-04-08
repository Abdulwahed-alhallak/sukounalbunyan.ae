<?php

namespace DionONE\Telegram\Listeners;

use DionONE\Telegram\Services\SendMsg;
use DionONE\Taskly\Events\CreateProjectTask;
use DionONE\Taskly\Models\Project;

class CreateProjectTaskLis
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
    public function handle(CreateProjectTask $event)
    {
        if(company_setting('Telegram New Task')  == 'on')
        {
            $task = $event->task;
            if(!empty($task))
            {
                $project = Project::where('id',$task->project_id)->first();
                $uArr = [
                    'task_name'    => $task->title,
                    'project_name' => $project->name
                ];
                SendMsg::SendMsgs($uArr , 'New Task');
            }
        }
    }
}
