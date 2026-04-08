<?php

namespace DionONE\Training\Http\Controllers;

use App\Http\Controllers\Controller;
use DionONE\Training\Models\TrainingTask;
use DionONE\Training\Models\Training;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use DionONE\Training\Events\CreateTrainingTask;
use DionONE\Training\Events\UpdateTrainingTask;
use DionONE\Training\Events\DestroyTrainingTask;
use DionONE\Training\Http\Requests\StoreTrainingTaskRequest;
use DionONE\Training\Http\Requests\UpdateTrainingTaskRequest;

class TrainingTaskController extends Controller
{
    public function index(Training $training)
    {
        if(Auth::user()->can('manage-training-tasks')){
            $tasks = TrainingTask::where('training_id', $training->id)
                ->where(function($q) {
                    if(Auth::user()->can('manage-any-training-tasks')) {
                        $q->where('created_by', creatorId());
                    } else if(Auth::user()->can('manage-own-training-tasks')) {
                        // Show tasks user created OR assigned to user's employee
                        $user = Auth::user();
                        $q->where(function($subQ) use ($user) {
                            $subQ->where('creator_id', $user->id)
                                 ->orWhere('assigned_to', $user->id);
                        });
                    } else {
                        $q->whereRaw('1 = 0');
                    }
                })
                ->with(['assignedUser', 'feedbacks'])
                ->get();

            $users = User::emp()->where('created_by', creatorId())->select('id', 'name')->get();

            return Inertia::render('Training/tasks/index', [
                'training' => $training,
                'tasks' => $tasks,
                'users' => $users,
            ]);
        }
        else{
            return back()->with('error', __('Permission denied'));
        }
    }

    public function store(StoreTrainingTaskRequest $request, Training $training)
    {
        if(Auth::user()->can('create-training-tasks')){
            $validated = $request->validated();

            $task              = new TrainingTask();
            $task->training_id = $training->id;
            $task->title       = $validated['title'];
            $task->description = $validated['description'];
            $task->due_date    = $validated['due_date'];
            $task->assigned_to = $validated['assigned_to'];
            $task->creator_id  = Auth::id();
            $task->created_by  = creatorId();
            $task->save();

            CreateTrainingTask::dispatch($request, $task);

            return back()->with('success', __('The task has been created successfully.'));
        }
        else{
            return back()->with('error', __('Permission denied'));
        }
    }

    public function update(UpdateTrainingTaskRequest $request, Training $training, TrainingTask $task)
    {
        if(Auth::user()->can('edit-training-tasks')){
            $validated = $request->validated();

            $task->title       = $validated['title'];
            $task->description = $validated['description'];
            $task->due_date    = $validated['due_date'];
            $task->assigned_to = $validated['assigned_to'];
            $task->save();

            UpdateTrainingTask::dispatch($request, $task);

            return back()->with('success', __('The task details are updated successfully.'));
        }
        else{
            return back()->with('error', __('Permission denied'));
        }
    }

    public function complete(Training $training, TrainingTask $task)
    {
        if(Auth::user()->can('edit-training-tasks')){
            $task->status = 'completed';
            $task->save();

            UpdateTrainingTask::dispatch(request(), $task);

            return back()->with('success', __('The task has been marked as completed.'));
        }
        else{
            return back()->with('error', __('Permission denied'));
        }
    }

    public function destroy(TrainingTask $task)
    {
        if(Auth::user()->can('delete-training-tasks')){
            DestroyTrainingTask::dispatch($task);
            
            $task->delete();
            return back()->with('success', __('The task has been deleted.'));
        }
        else{
            return back()->with('error', __('Permission denied'));
        }
    }
}