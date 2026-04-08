<?php

namespace App\Http\Controllers;

use App\Models\WorkflowRule;
use App\Models\WorkflowLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WorkflowController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $companyId = $user->type === 'company' ? $user->id : $user->created_by;

        $rules = WorkflowRule::forCompany($companyId)
            ->with('creator:id,name')
            ->withCount('logs')
            ->orderByDesc('updated_at')
            ->paginate(15);

        return Inertia::render('workflows/Index', [
            'rules' => $rules,
            'modules' => WorkflowRule::MODULES,
            'events' => WorkflowRule::EVENTS,
            'actionTypes' => WorkflowRule::ACTION_TYPES,
            'operators' => WorkflowRule::OPERATORS,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'trigger_module' => 'required|string',
            'trigger_event' => 'required|string',
            'actions' => 'required|array|min:1',
            'actions.*.type' => 'required|string',
        ]);

        $user = Auth::user();
        $companyId = $user->type === 'company' ? $user->id : $user->created_by;

        WorkflowRule::create([
            'company_id' => $companyId,
            'name' => $request->name,
            'description' => $request->description,
            'is_active' => $request->is_active ?? true,
            'priority' => $request->priority ?? 0,
            'trigger_module' => $request->trigger_module,
            'trigger_event' => $request->trigger_event,
            'trigger_conditions' => $request->trigger_conditions ?? [],
            'actions' => $request->actions,
            'schedule_type' => $request->schedule_type ?? 'immediate',
            'delay_minutes' => $request->delay_minutes,
            'created_by' => $user->id,
        ]);

        return redirect()->route('workflows.index')->with('success', 'Workflow rule created.');
    }

    public function update(Request $request, WorkflowRule $workflow)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'trigger_module' => 'required|string',
            'trigger_event' => 'required|string',
            'actions' => 'required|array|min:1',
        ]);

        $workflow->update([
            'name' => $request->name,
            'description' => $request->description,
            'is_active' => $request->is_active ?? true,
            'priority' => $request->priority ?? 0,
            'trigger_module' => $request->trigger_module,
            'trigger_event' => $request->trigger_event,
            'trigger_conditions' => $request->trigger_conditions ?? [],
            'actions' => $request->actions,
            'schedule_type' => $request->schedule_type ?? 'immediate',
            'delay_minutes' => $request->delay_minutes,
        ]);

        return redirect()->route('workflows.index')->with('success', 'Workflow rule updated.');
    }

    public function toggleActive(WorkflowRule $workflow)
    {
        $workflow->update(['is_active' => !$workflow->is_active]);
        return back();
    }

    public function destroy(WorkflowRule $workflow)
    {
        $workflow->logs()->delete();
        $workflow->delete();
        return redirect()->route('workflows.index')->with('success', 'Workflow rule deleted.');
    }

    public function logs(Request $request)
    {
        $user = Auth::user();
        $companyId = $user->type === 'company' ? $user->id : $user->created_by;

        $logs = WorkflowLog::forCompany($companyId)
            ->with('rule:id,name')
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('workflows/Logs', [
            'logs' => $logs,
        ]);
    }
}
