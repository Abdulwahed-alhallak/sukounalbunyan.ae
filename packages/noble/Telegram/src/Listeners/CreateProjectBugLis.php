<?php

namespace Noble\Telegram\Listeners;

use Noble\Telegram\Services\SendMsg;
use Noble\Taskly\Events\CreateProjectBug;
use Noble\Taskly\Models\Project;

class CreateProjectBugLis
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
    public function handle(CreateProjectBug $event)
    {

        if(company_setting('Telegram New Bug')  == 'on')
        {
            $bug = $event->bug;
            if(!empty($bug))
            {
                $project = Project::where('id',$bug->project_id)->first();
                $uArr = [
                    'bug_name' => $bug->title,
                    'project_name'=>$project->name,
                ];
                SendMsg::SendMsgs($uArr , 'New Bug');
            }
        }
    }
}
