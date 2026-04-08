<?php

namespace DionONE\Hrm\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use DionONE\Hrm\Models\EmployeeViolation;
use DionONE\Hrm\Models\ViolationType;
use App\Models\User;

class ViolationController extends Controller
{
    public function index()
    {
        if (Auth::user()->can('manage-employees')) {
            $violations = EmployeeViolation::query()
                ->with(['employee:id,name', 'violationType'])
                ->where(function ($q) {
                    if (Auth::user()->can('manage-any-employees')) {
                        $q->where('created_by', creatorId());
                    } elseif (Auth::user()->can('manage-own-employees')) {
                        $q->where('employee_id', Auth::id());
                    } else {
                        $q->whereRaw('1 = 0');
                    }
                })
                ->when(request('employee_id') && request('employee_id') !== 'all', fn($q) => $q->where('employee_id', request('employee_id')))
                ->when(request('sort'), fn($q) => $q->orderBy(request('sort'), request('direction', 'asc')), fn($q) => $q->latest())
                ->paginate(request('per_page', 10))
                ->withQueryString();

            return Inertia::render('Hrm/Violations/Index', [
                'violations' => $violations,
                'users' => User::where('created_by', creatorId())->select('id', 'name')->get(),
                'violationTypes' => ViolationType::where('created_by', creatorId())->get(),
            ]);
        } else {
            return back()->with('error', __('Permission denied'));
        }
    }

    public function store(Request $request)
    {
        if (Auth::user()->can('manage-employees')) {
            $validated = $request->validate([
                'employee_id' => 'required|integer',
                'violation_type_id' => 'required|integer',
                'violation_date' => 'required|date',
                'incident_date' => 'nullable|date',
                'description' => 'nullable|string',
                'action_taken' => 'nullable|string',
                'deduction_amount' => 'nullable|numeric'
            ]);

            $validated['created_by'] = creatorId();
            $validated['status'] = 'Applied';
            
            EmployeeViolation::create($validated);

            return redirect()->back()->with('success', __('Violation created successfully.'));
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }

    public function update(Request $request, EmployeeViolation $violation)
    {
        if (Auth::user()->can('manage-employees')) {
            $validated = $request->validate([
                'employee_id' => 'required|integer',
                'violation_type_id' => 'required|integer',
                'violation_date' => 'required|date',
                'incident_date' => 'nullable|date',
                'description' => 'nullable|string',
                'action_taken' => 'nullable|string',
                'deduction_amount' => 'nullable|numeric'
            ]);

            $violation->update($validated);

            return redirect()->back()->with('success', __('Violation updated successfully.'));
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }

    public function destroy(EmployeeViolation $violation)
    {
        if (Auth::user()->can('manage-employees')) {
            $violation->delete();
            return redirect()->back()->with('success', __('Violation deleted successfully.'));
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }
}
