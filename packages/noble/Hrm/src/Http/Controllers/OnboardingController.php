<?php

namespace Noble\Hrm\Http\Controllers;

use App\Models\User;
use Noble\Hrm\Models\EmployeeOnboarding;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function index()
    {
        if (Auth::user()->can('manage-hrm')) {
            $onboardings = EmployeeOnboarding::with(['employee:id,name', 'assignee:id,name'])
                ->where('created_by', creatorId())
                ->when(request('search'), function ($q) {
                    $q->whereHas('employee', function ($query) {
                        $query->where('name', 'like', '%' . request('search') . '%');
                    });
                })
                ->when(request('status'), fn($q) => $q->where('status', request('status')))
                ->when(request('sort'), fn($q) => $q->orderBy(request('sort'), request('direction', 'asc')), fn($q) => $q->latest())
                ->paginate(request('per_page', 15))
                ->withQueryString();

            $employees = User::where('created_by', creatorId())
                ->where('type', 'staff')
                ->select('id', 'name')
                ->orderBy('name')
                ->get();

            return Inertia::render('Hrm/Onboarding/Index', [
                'onboardings' => $onboardings,
                'employees' => $employees,
                'defaultChecklist' => EmployeeOnboarding::defaultChecklist(),
            ]);
        }
        return back()->with('error', __('Permission denied'));
    }

    public function store(Request $request)
    {
        if (Auth::user()->can('manage-hrm')) {
            $validated = $request->validate([
                'employee_id' => 'required|exists:users,id',
                'start_date' => 'nullable|date',
                'due_date' => 'nullable|date|after_or_equal:start_date',
                'assigned_to' => 'nullable|exists:users,id',
                'notes' => 'nullable|string',
                'checklist_items' => 'nullable|array',
            ]);

            $validated['status'] = 'pending';
            $validated['created_by'] = creatorId();
            if (empty($validated['checklist_items'])) {
                $validated['checklist_items'] = EmployeeOnboarding::defaultChecklist();
            }

            EmployeeOnboarding::create($validated);

            return redirect()->route('hrm.onboarding.index')->with('success', __('Onboarding created successfully'));
        }
        return back()->with('error', __('Permission denied'));
    }

    public function update(Request $request, EmployeeOnboarding $onboarding)
    {
        if (Auth::user()->can('manage-hrm')) {
            $validated = $request->validate([
                'status' => 'nullable|string|in:pending,in_progress,completed',
                'due_date' => 'nullable|date',
                'assigned_to' => 'nullable|exists:users,id',
                'notes' => 'nullable|string',
                'checklist_items' => 'nullable|array',
            ]);

            // Check if all checklist items are completed
            if (!empty($validated['checklist_items'])) {
                $allComplete = collect($validated['checklist_items'])->every(fn($item) => $item['completed'] ?? false);
                if ($allComplete) {
                    $validated['status'] = 'completed';
                    $validated['completed_at'] = now();
                } elseif (collect($validated['checklist_items'])->contains(fn($item) => $item['completed'] ?? false)) {
                    $validated['status'] = 'in_progress';
                }
            }

            $onboarding->update($validated);

            return redirect()->route('hrm.onboarding.index')->with('success', __('Onboarding updated successfully'));
        }
        return back()->with('error', __('Permission denied'));
    }

    public function destroy(EmployeeOnboarding $onboarding)
    {
        if (Auth::user()->can('manage-hrm')) {
            $onboarding->delete();
            return redirect()->route('hrm.onboarding.index')->with('success', __('Onboarding deleted successfully'));
        }
        return back()->with('error', __('Permission denied'));
    }
}
