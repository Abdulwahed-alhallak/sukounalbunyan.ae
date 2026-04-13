<?php

namespace Noble\Hrm\Http\Controllers;

use App\Models\User;
use Noble\Hrm\Models\Award;
use Noble\Hrm\Http\Requests\StoreAwardRequest;
use Noble\Hrm\Http\Requests\UpdateAwardRequest;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Noble\Hrm\Models\AwardType;
use Noble\Hrm\Models\Employee;
use Noble\Hrm\Events\CreateAward;
use Noble\Hrm\Events\DestroyAward;
use Noble\Hrm\Events\UpdateAward;

class AwardController extends Controller
{
    public function index()
    {
        if (Auth::user()->can('manage-awards')) {
            $awards = Award::with(['awardType:id,name', 'employee:id,name'])->where(function ($q) {
                if (Auth::user()->can('manage-any-awards')) {
                    $q->where('created_by', operator: creatorId());
                } elseif (Auth::user()->can('manage-own-awards')) {
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
                ->when(request('award_type_id'), fn($q) => $q->where('award_type_id', request('award_type_id')))

                ->when(request('sort'), fn($q) => $q->orderBy(request('sort'), request('direction', 'asc')), fn($q) => $q->latest())
                ->paginate(request('per_page', 10))
                ->withQueryString();

            return Inertia::render('Hrm/Awards/Index', [
                'awards' => $awards,
                'employees' => $this->getFilteredEmployees(),
                'awardTypes' => AwardType::where('created_by', creatorId())->select('id', 'name')->get(),
            ]);
        } else {
            return back()->with('error', __('Permission denied'));
        }
    }

    public function store(StoreAwardRequest $request)
    {
        if (Auth::user()->can('create-awards')) {
            $validated = $request->validated();
            $award = new Award();
            $award->employee_id = $validated['employee_id'];
            $award->award_type_id = $validated['award_type_id'];
            $award->award_date = $validated['award_date'];
            $award->description = $validated['description'];
            $award->certificate = $validated['certificate'];
            $award->status = 'pending';
            $award->manager_status = 'pending';

            $award->creator_id = Auth::id();
            $award->created_by = creatorId();
            $award->save();

            CreateAward::dispatch($request, $award);

            return redirect()->route('hrm.awards.index')->with('success', __('The award has been created successfully.'));
        } else {
            return redirect()->route('hrm.awards.index')->with('error', __('Permission denied'));
        }
    }

    public function update(UpdateAwardRequest $request, Award $award)
    {
        if (Auth::user()->can('edit-awards')) {
            $validated = $request->validated();



            $award->employee_id = $validated['employee_id'];
            $award->award_type_id = $validated['award_type_id'];
            $award->award_date = $validated['award_date'];
            $award->description = $validated['description'];
            $award->certificate = $validated['certificate'];

            $award->save();

            UpdateAward::dispatch($request, $award);

            return redirect()->back()->with('success', __('The award details are updated successfully.'));
        } else {
            return redirect()->route('hrm.awards.index')->with('error', __('Permission denied'));
        }
    }

    public function destroy(Award $award)
    {
        if (Auth::user()->can('delete-awards')) {
            DestroyAward::dispatch($award);
            $award->delete();

            return redirect()->back()->with('success', __('The award has been deleted.'));
        } else {
            return redirect()->route('hrm.awards.index')->with('error', __('Permission denied'));
        }
    }

    public function updateStatus(\Illuminate\Http\Request $request, Award $award)
    {
        $request->validate([
            'status' => 'nullable|in:pending,approved,rejected',
            'manager_status' => 'nullable|in:pending,approved,rejected',
            'approver_comment' => 'nullable|string',
        ]);

        $isMultiTierEnabled = getCompanyAllSetting(creatorId())['enable_multi_tier_approval'] ?? 'on';

        // Manager Approval Flow
        if ($request->has('manager_status')) {
            $employee = Employee::where('user_id', $award->employee_id)->first();
            
            // Check if auth user is the line manager OR a superadmin/admin bypassing
            if (Auth::user()->can('manage-any-awards') || ($employee && $employee->line_manager == Auth::id())) {
                $award->manager_status = $request->manager_status;
                $award->manager_id = Auth::id();
                $award->manager_comment = $request->has('status') ? $award->manager_comment : $request->approver_comment;
                
                // If manager rejects, auto-reject the final status
                if ($request->manager_status === 'rejected') {
                    $award->status = 'rejected';
                }
            } else {
                return redirect()->back()->with('error', __('Only line manager can update manager status.'));
            }
        }

        // HR Final Approval Flow
        if ($request->has('status')) {
            if (!Auth::user()->can('edit-awards')) {
                return redirect()->back()->with('error', __('Permission denied'));
            }

            if ($isMultiTierEnabled === 'on' && $award->manager_status !== 'approved' && $request->status === 'approved') {
                return redirect()->back()->with('error', __('Award must be approved by the line manager first.'));
            }

            $award->status = $request->status;
        }

        $award->save();

        return redirect()->back()->with('success', __('Award status updated successfully.'));
    }

    private function getFilteredEmployees()
    {
        $employeeQuery = Employee::where('created_by', creatorId());

        if (Auth::user()->can('manage-own-awards') && !Auth::user()->can('manage-any-awards')) {
            $employeeQuery->where(function ($q) {
                $q->where('creator_id', Auth::id())->orWhere('user_id', Auth::id());
            });
        }

        return User::emp()->where('created_by', creatorId())
            ->whereIn('id', $employeeQuery->pluck('user_id'))
            ->select('id', 'name')->get();
    }
}
