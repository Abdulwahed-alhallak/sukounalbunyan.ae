<?php

namespace Noble\Hrm\Http\Controllers;

use App\Models\User;
use Noble\Hrm\Models\Resignation;
use Noble\Hrm\Http\Requests\StoreResignationRequest;
use Noble\Hrm\Http\Requests\UpdateResignationRequest;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Noble\Hrm\Events\UpdateResignaionStatus;
use Noble\Hrm\Models\Employee;

class ResignationController extends Controller
{
    public function index()
    {
        if (Auth::user()->can('manage-resignations')) {
            $resignations = Resignation::with([
                'employee:id,name',
                'approvedBy:id,name'
            ])->where(function ($q) {
                if (Auth::user()->can('manage-any-resignations')) {
                    $q->where('created_by', creatorId());
                } elseif (Auth::user()->can('manage-own-resignations')) {
                    $q->where('creator_id', Auth::id())->orWhere('employee_id', Auth::id());
                } else {
                    $q->whereRaw('1 = 0');
                }
            })
                ->when(request('name'), function ($q) {
                    $q->whereHas('employee', function ($query) {
                        $query->where('name', 'like', '%' . request('name') . '%');
                    });
                })
                ->when(request('employee_id'), fn($q) => $q->where('employee_id', request('employee_id')))

                ->when(request('sort'), fn($q) => $q->orderBy(request('sort'), request('direction', 'asc')), fn($q) => $q->latest())
                ->paginate(request('per_page', 10))
                ->withQueryString();

            return Inertia::render('Hrm/Resignations/Index', [
                'resignations' => $resignations,
                'employees' => $this->getFilteredEmployees(),
                'users' => User::where('created_by', creatorId())->select('id', 'name')->get(),
            ]);
        } else {
            return back()->with('error', __('Permission denied'));
        }
    }

    public function store(StoreResignationRequest $request)
    {
        if (Auth::user()->can('create-resignations')) {
            $validated = $request->validated();
            $resignation = new Resignation();
            $resignation->employee_id = $validated['employee_id'];
            $resignation->last_working_date = $validated['last_working_date'];
            $resignation->reason = $validated['reason'];
            $resignation->description = $validated['description'];
            $resignation->document = $validated['document'];

            $resignation->creator_id = Auth::id();
            $resignation->created_by = creatorId();
            $resignation->save();

            return redirect()->route('hrm.resignations.index')->with('success', __('The resignation has been created successfully.'));
        } else {
            return redirect()->route('hrm.resignations.index')->with('error', __('Permission denied'));
        }
    }

    public function update(UpdateResignationRequest $request, Resignation $resignation)
    {
        if (Auth::user()->can('edit-resignations')) {
            $validated = $request->validated();



            $resignation->employee_id = $validated['employee_id'];
            $resignation->last_working_date = $validated['last_working_date'];
            $resignation->reason = $validated['reason'];
            $resignation->description = $validated['description'];
            $resignation->document = $validated['document'];

            $resignation->save();

            return redirect()->back()->with('success', __('The resignation details are updated successfully.'));
        } else {
            return redirect()->route('hrm.resignations.index')->with('error', __('Permission denied'));
        }
    }

    public function destroy(Resignation $resignation)
    {
        if (Auth::user()->can('delete-resignations')) {
            $resignation->delete();

            return redirect()->back()->with('success', __('The resignation has been deleted.'));
        } else {
            return redirect()->route('hrm.resignations.index')->with('error', __('Permission denied'));
        }
    }

    public function updateStatus(Request $request, Resignation $resignation)
    {
        $request->validate([
            'status' => 'nullable|in:pending,accepted,rejected',
            'manager_status' => 'nullable|in:pending,accepted,rejected',
            'approver_comment' => 'nullable|string',
        ]);

        $isMultiTierEnabled = getCompanyAllSetting(creatorId())['enable_multi_tier_approval'] ?? 'on';

        // Manager Approval Flow
        if ($request->has('manager_status')) {
            $employee = Employee::where('user_id', $resignation->employee_id)->first();
            
            // Check if auth user is the line manager OR a superadmin/admin bypassing
            if (Auth::user()->can('manage-any-resignations') || ($employee && $employee->line_manager == Auth::id())) {
                $resignation->manager_status = $request->manager_status;
                $resignation->manager_id = Auth::id();
                $resignation->manager_comment = $request->has('status') ? $resignation->manager_comment : $request->approver_comment;
                
                // If manager rejects, auto-reject the final status
                if ($request->manager_status === 'rejected') {
                    $resignation->status = 'rejected';
                    $resignation->approved_by = Auth::id();
                }
            } else {
                return redirect()->back()->with('error', __('Only line manager can update manager status.'));
            }
        }

        // HR Final Approval Flow
        if ($request->has('status')) {
            if (!Auth::user()->can('manage-resignation-status')) {
                return redirect()->back()->with('error', __('Permission denied'));
            }

            if ($isMultiTierEnabled === 'on' && $resignation->manager_status !== 'accepted' && $request->status === 'accepted') {
                return redirect()->back()->with('error', __('Resignation must be evaluated by the line manager first.'));
            }

            $resignation->status = $request->status;
            $resignation->approved_by = Auth::id();
        }

        $resignation->save();
        UpdateResignaionStatus::dispatch($request, $resignation);

        return redirect()->back()->with('success', __('The resignation status has been updated.'));
    }

    private function getFilteredUsers()
    {
        return User::emp()->where('created_by', creatorId())
            ->when(!Auth::user()->can('manage-any-resignations'), function ($q) {
                if (Auth::user()->can('manage-own-resignations')) {
                    $q->where('creator_id', Auth::id());
                } else {
                    $q->whereRaw('1 = 0');
                }
            })
            ->select('id', 'name')->get();
    }


    private function getFilteredEmployees()
    {
        $employeeQuery = Employee::where('created_by', creatorId());

        if (Auth::user()->can('manage-own-resignations') && !Auth::user()->can('manage-any-resignations')) {
            $employeeQuery->where(function ($q) {
                $q->where('creator_id', Auth::id())->orWhere('user_id', Auth::id());
            });
        }

        return User::emp()->where('created_by', creatorId())
            ->whereIn('id', $employeeQuery->pluck('user_id'))
            ->select('id', 'name')->get();
    }
}
