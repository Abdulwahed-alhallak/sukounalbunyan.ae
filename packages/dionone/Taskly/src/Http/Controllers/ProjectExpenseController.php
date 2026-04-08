<?php

namespace DionONE\Taskly\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use DionONE\Taskly\Models\Project;
use DionONE\Taskly\Models\ProjectExpense;
use Carbon\Carbon;

class ProjectExpenseController extends Controller
{
    public function store(Request $request, Project $project)
    {
        if (Auth::user()->can('manage-project')) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0',
                'date' => 'required|date',
                'description' => 'nullable|string',
            ]);

            $expense = new ProjectExpense();
            $expense->project_id = $project->id;
            $expense->name = $validated['name'];
            $expense->amount = $validated['amount'];
            $expense->date = $validated['date'];
            $expense->description = $validated['description'];
            $expense->created_by = creatorId();
            $expense->save();

            // Log Activity
            \DionONE\Taskly\Models\ActivityLog::create([
                'user_id' => Auth::user()->id,
                'user_type' => get_class(Auth::user()),
                'project_id' => $project->id,
                'log_type' => 'Add Expense',
                'remark' => json_encode(['title' => $expense->name]),
            ]);

            return back()->with('success', __('Project expense created successfully.'));
        }
        return back()->with('error', __('Permission denied'));
    }

    public function destroy(Request $request, ProjectExpense $expense)
    {
        if (Auth::user()->can('manage-project')) {
            $expense->delete();
            return back()->with('success', __('Project expense deleted successfully.'));
        }
        return back()->with('error', __('Permission denied'));
    }
}
