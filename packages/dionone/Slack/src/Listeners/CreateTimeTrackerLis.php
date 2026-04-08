<?php

namespace DionONE\Slack\Listeners;

use App\Models\User;
use DionONE\Slack\Services\SendMsg;
use DionONE\Taskly\Models\Project;
use DionONE\Taskly\Models\ProjectTask;
use DionONE\TimeTracker\Events\CreateTimeTracker;

class CreateTimeTrackerLis
{
    public function __construct()
    {
        //
    }

    public function handle(CreateTimeTracker $event)
    {
        $track   = $event->timeTracker;
        $task    = ProjectTask::find($track->task_id);
        $project = Project::find($track->project_id);
        $usersId = is_array($task->assigned_to) ? $task->assigned_to : explode(',', $task->assigned_to);
        $users   = User::whereIn('id' , $usersId)->get();

        if (company_setting('Whatsapp New Tracker')  == 'on') {

            foreach($users as $user)
            {
                if(!empty($track) && !empty($project) && !empty($user->mobile_no))
                {
                    $uArr = [
                        'task_name'    => $track->title,
                        'project_name' => $project->name,
                    ];
                    SendMsg::SendMsgs($uArr, 'New Tracker');
                }
            }
        }
    }
}