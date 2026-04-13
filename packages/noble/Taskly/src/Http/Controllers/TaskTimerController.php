<?php

namespace Noble\Taskly\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Noble\Taskly\Models\TaskTimer;
use Noble\Taskly\Models\ProjectTask;
use Carbon\Carbon;

class TaskTimerController extends Controller
{
    public function start(Request $request, ProjectTask $task)
    {
        if (Auth::user()->can('manage-project-task')) {
            // Check if user already has an active timer for this task
            $activeTimer = TaskTimer::where('task_id', $task->id)
                ->where('user_id', Auth::id())
                ->whereNull('end_time')
                ->first();

            if ($activeTimer) {
                return response()->json(['error' => __('You already have an active timer for this task.')], 400);
            }

            // Start new timer
            $timer = new TaskTimer();
            $timer->project_id = $task->project_id;
            $timer->task_id = $task->id;
            $timer->user_id = Auth::id();
            $timer->start_time = now();
            $timer->is_billable = true;
            $timer->created_by = creatorId();
            $timer->save();

            return response()->json(['success' => true, 'message' => __('Timer started successfully.'), 'timer' => $timer]);
        }
        return response()->json(['error' => __('Permission denied')], 403);
    }

    public function stop(Request $request, ProjectTask $task)
    {
        if (Auth::user()->can('manage-project-task')) {
            $activeTimer = TaskTimer::where('task_id', $task->id)
                ->where('user_id', Auth::id())
                ->whereNull('end_time')
                ->first();

            if (!$activeTimer) {
                return response()->json(['error' => __('No active timer found for this task.')], 400);
            }

            $endTime = now();
            $startTime = Carbon::parse($activeTimer->start_time);
            $durationSeconds = $endTime->diffInSeconds($startTime);

            $activeTimer->end_time = $endTime;
            $activeTimer->duration_seconds = $durationSeconds;
            $activeTimer->save();

            return response()->json(['success' => true, 'message' => __('Timer stopped successfully.'), 'timer' => $activeTimer]);
        }
        return response()->json(['error' => __('Permission denied')], 403);
    }

    public function getTimers(ProjectTask $task)
    {
        if (Auth::user()->can('manage-project-task')) {
            $timers = TaskTimer::where('task_id', $task->id)
                ->with('user:id,name,avatar')
                ->orderBy('created_at', 'desc')
                ->get();

            // Calculate total duration globally across all timers
            $totalDuration = $timers->sum('duration_seconds');

            return response()->json([
                'success' => true, 
                'timers' => $timers,
                'total_duration' => $totalDuration
            ]);
        }
        return response()->json(['error' => __('Permission denied')], 403);
    }
}
