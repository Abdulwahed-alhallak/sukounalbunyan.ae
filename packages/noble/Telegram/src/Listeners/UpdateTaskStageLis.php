<?php

namespace Noble\Telegram\Listeners;

use Noble\Telegram\Services\SendMsg;
use Noble\Taskly\Events\UpdateTaskStage;
use Noble\Taskly\Models\TaskStage;

class UpdateTaskStageLis
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
    public function handle(UpdateTaskStage $event)
    {
        if(company_setting('Telegram Task Stage Updated')  == 'on')
        {
            $request = $event->request;
            $task    = $event->taskStage;

            if(!empty($task))
            {
                $new_status   = TaskStage::where('id',$request->new_status)->first();
                $old_status   = TaskStage::where('id',$request->old_status)->first();

                $uArr = [
                    'task_name'  => $task->title,
                    'old_status' => $old_status->name,
                    'new_status' => $new_status->name,
                ];

                SendMsg::SendMsgs($uArr , 'Task Stage Updated');
            }
        }
    }
}
