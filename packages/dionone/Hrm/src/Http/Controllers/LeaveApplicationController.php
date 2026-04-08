<?php

namespace DionONE\Hrm\Http\Controllers;

use DionONE\Hrm\Models\LeaveApplication;
use DionONE\Hrm\Http\Requests\StoreLeaveApplicationRequest;
use DionONE\Hrm\Http\Requests\UpdateLeaveApplicationRequest;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use DionONE\Hrm\Models\LeaveType;
use DionONE\Hrm\Models\Employee;
use DionONE\Hrm\Events\CreateLeaveApplication;
use DionONE\Hrm\Events\UpdateLeaveApplication;
use DionONE\Hrm\Events\DestroyLeaveApplication;
use DionONE\Hrm\Events\UpdateLeaveStatus;
use DionONE\Hrm\Models\Holiday;
use DionONE\Taskly\Models\TaskAttachment;

class LeaveApplicationController extends Controller
{
    public function index()
    {
        $isMultiTierEnabled = getCompanyAllSetting(creatorId())['enable_multi_tier_approval'] ?? 'on';

        if (Auth::user()->can('manage-leave-applications')) {
            $leaveapplications = LeaveApplication::query()
                ->with(['employee.employee', 'leave_type', 'approved_by', 'attachments.uploader:id,name'])
                ->where(function ($q) {
                    if (Auth::user()->can('manage-any-leave-applications')) {
                        $q->where('created_by', creatorId());
                    } elseif (Auth::user()->can('manage-own-leave-applications')) {
                        $q->where('creator_id', Auth::id())
                          ->orWhere('employee_id', Auth::id())
                          ->orWhereIn('employee_id', function($subQuery) {
                              $subQuery->select('user_id')->from('employees')->where('line_manager', Auth::id());
                          });
                    } else {
                        // Allow managers to see their team's requests even if they don't have manage-own permission.
                        $q->whereIn('employee_id', function($subQuery) {
                            $subQuery->select('user_id')->from('employees')->where('line_manager', Auth::id());
                        });
                    }
                })
                ->when(request('reason'), function ($q) {
                    $q->where(function ($query) {
                        $query
                            ->where('reason', 'like', '%' . request('reason') . '%')
                            ->orWhereHas('employee', function ($subQuery) {
                                $subQuery->where('name', 'like', '%' . request('reason') . '%');
                            })
                            ->orWhereHas('leave_type', function ($subQuery) {
                                $subQuery->where('name', 'like', '%' . request('reason') . '%');
                            });
                    });
                })
                ->when(request('status') !== null && request('status') !== '', fn($q) => $q->where('status', request('status')))
                ->when(request('employee_id'), fn($q) => $q->where('employee_id', request('employee_id')))
                ->when(request('leave_type_id'), fn($q) => $q->where('leave_type_id', request('leave_type_id')))
                ->when(request('start_date'), fn($q) => $q->whereDate('start_date', '>=', request('start_date')))
                ->when(request('end_date'), fn($q) => $q->whereDate('end_date', '<=', request('end_date')))
                ->when(request('sort'), fn($q) => $q->orderBy(request('sort'), request('direction', 'asc')), fn($q) => $q->latest())
                ->paginate(request('per_page', 10))
                ->withQueryString();

            return Inertia::render('Hrm/LeaveApplications/Index', [
                'leaveapplications' => $leaveapplications,
                'employees' => $this->getFilteredEmployees(),
                'leavetypes' => LeaveType::where('created_by', creatorId())->select('id', 'name')->get(),
                'isMultiTierEnabled' => $isMultiTierEnabled === 'on',
            ]);
        } else {
            return back()->with('error', __('Permission denied'));
        }
    }

    public function timeline()
    {
        if (Auth::user()->can('manage-leave-applications')) {
            $month = request('month', now()->month);
            $year = request('year', now()->year);

            $leaves = LeaveApplication::query()
                ->with(['employee.employee', 'leave_type'])
                ->where('created_by', creatorId())
                ->where('status', 'Approved')
                ->where(function ($q) use ($month, $year) {
                    $q->whereMonth('start_date', $month)
                      ->whereYear('start_date', $year)
                      ->orWhere(function ($query) use ($month, $year) {
                          $query->whereMonth('end_date', $month)
                                ->whereYear('end_date', $year);
                      });
                })
                ->get();

            return Inertia::render('Hrm/LeaveApplications/Timeline', [
                'leaves' => $leaves,
                'currentMonth' => $month,
                'currentYear' => $year
            ]);
        } else {
            return back()->with('error', __('Permission denied'));
        }
    }

    public function store(StoreLeaveApplicationRequest $request)
    {
        if (Auth::user()->can('create-leave-applications')) {
            $validated = $request->validated();

            // Calculate total days automatically excluding weekends and holidays
            $startDate = \Carbon\Carbon::parse($validated['start_date']);
            $endDate = \Carbon\Carbon::parse($validated['end_date']);
            
            $workingDaysSettings = getCompanyAllSetting(creatorId())['working_days'] ?? '';
            $workingDaysArray = json_decode($workingDaysSettings, true) ?? [];
            
            $totalDays = 0;
            $currentDate = clone $startDate;
            
            while ($currentDate <= $endDate) {
                $isWorkingDay = in_array($currentDate->dayOfWeek, $workingDaysArray);
                $isHoliday = Holiday::where('created_by', creatorId())
                    ->where('start_date', '<=', $currentDate)
                    ->where('end_date', '>=', $currentDate)
                    ->exists();
                
                if ($isWorkingDay && !$isHoliday) {
                    $totalDays++;
                }
                
                $currentDate->addDay();
            }

            if ($totalDays == 0) {
                return redirect()->back()->with('error', __('Leave duration contains no valid working days.'));
            }

            // Get leave type details
            $leaveType = LeaveType::find($validated['leave_type_id']);
            if (!$leaveType) {
                return redirect()
                    ->back()
                    ->withErrors(['leave_type_id' => __('Invalid leave type selected.')]);
            }

            // Get current year
            $currentYear = date('Y');

            // Calculate used leaves for this employee, leave type and current year
            $usedLeaves = LeaveApplication::where('employee_id', $validated['employee_id'])
                ->where('leave_type_id', $validated['leave_type_id'])
                ->whereIn('status', ['approved', 'pending'])
                ->whereYear('start_date', $currentYear)
                ->sum('total_days');

            // Check for overlapping leave applications
            $overlappingLeave = LeaveApplication::where('employee_id', $validated['employee_id'])
                ->where(function ($query) use ($validated) {
                    $query
                        ->whereBetween('start_date', [$validated['start_date'], $validated['end_date']])
                        ->orWhereBetween('end_date', [$validated['start_date'], $validated['end_date']])
                        ->orWhere(function ($q) use ($validated) {
                            $q->where('start_date', '<=', $validated['start_date'])->where('end_date', '>=', $validated['end_date']);
                        });
                })
                ->whereIn('status', ['approved', 'pending'])
                ->first();

            if ($overlappingLeave) {
                $startDate = \Carbon\Carbon::parse($overlappingLeave->start_date)->format('Y-m-d');
                $endDate = \Carbon\Carbon::parse($overlappingLeave->end_date)->format('Y-m-d');

                return redirect()
                    ->back()
                    ->withErrors([
                        'start_date' => "Leave already applied for overlapping dates from {$startDate} to {$endDate}",
                    ]);
            }

            // Check if requested days exceed available balance
            $availableLeaves = $leaveType->max_days_per_year - $usedLeaves;
            if ($totalDays > $availableLeaves) {
                return redirect()
                    ->back()
                    ->withErrors([
                        'start_date' => __('Insufficient leave balance. Available: :available days, Requested: :requested days', [
                            'available' => $availableLeaves,
                            'requested' => $totalDays,
                        ]),
                    ]);
            }

            $leaveapplication = new LeaveApplication();
            $leaveapplication->fill($validated);
            $leaveapplication->total_days = $totalDays;
            $leaveapplication->status = 'pending';
            $leaveapplication->creator_id = Auth::id();
            $leaveapplication->created_by = creatorId();
            $leaveapplication->save();

            // Store attachments
            if ($request->has('attachment_ids')) {
                $leaveapplication->syncAttachments($request->input('attachment_ids'));
            }

            CreateLeaveApplication::dispatch($request, $leaveapplication);

            return redirect()->route('hrm.leave-applications.index')->with('success', __('The leaveapplication has been created successfully.'));
        } else {
            return redirect()->route('hrm.leave-applications.index')->with('error', __('Permission denied'));
        }
    }

    public function update(UpdateLeaveApplicationRequest $request, LeaveApplication $leaveapplication)
    {
        if (Auth::user()->can('edit-leave-applications')) {
            $validated = $request->validated();

            // Calculate total days automatically excluding weekends and holidays
            $startDate = \Carbon\Carbon::parse($validated['start_date']);
            $endDate = \Carbon\Carbon::parse($validated['end_date']);
            
            $workingDaysSettings = getCompanyAllSetting(creatorId())['working_days'] ?? '';
            $workingDaysArray = json_decode($workingDaysSettings, true) ?? [];
            
            $totalDays = 0;
            $currentDate = clone $startDate;
            
            while ($currentDate <= $endDate) {
                $isWorkingDay = in_array($currentDate->dayOfWeek, $workingDaysArray);
                $isHoliday = Holiday::where('created_by', creatorId())
                    ->where('start_date', '<=', $currentDate)
                    ->where('end_date', '>=', $currentDate)
                    ->exists();
                
                if ($isWorkingDay && !$isHoliday) {
                    $totalDays++;
                }
                
                $currentDate->addDay();
            }

            if ($totalDays == 0) {
                return redirect()->back()->with('error', __('Leave duration contains no valid working days.'));
            }

            // Get leave type details
            $leaveType = LeaveType::find($validated['leave_type_id']);
            if (!$leaveType) {
                return redirect()
                    ->back()
                    ->withErrors(['leave_type_id' => __('Invalid leave type selected.')]);
            }

            // Get current year
            $currentYear = date('Y');

            // Calculate used leaves for this employee, leave type and current year (excluding current application)
            $usedLeaves = LeaveApplication::where('employee_id', $validated['employee_id'])
                ->where('leave_type_id', $validated['leave_type_id'])
                ->whereIn('status', ['approved', 'pending'])
                ->whereYear('start_date', $currentYear)
                ->where('id', '!=', $leaveapplication->id)
                ->sum('total_days');

            // Check for overlapping leave applications (excluding current application)
            $overlappingLeave = LeaveApplication::where('employee_id', $validated['employee_id'])
                ->where('id', '!=', $leaveapplication->id)
                ->where(function ($query) use ($validated) {
                    $query
                        ->whereBetween('start_date', [$validated['start_date'], $validated['end_date']])
                        ->orWhereBetween('end_date', [$validated['start_date'], $validated['end_date']])
                        ->orWhere(function ($q) use ($validated) {
                            $q->where('start_date', '<=', $validated['start_date'])->where('end_date', '>=', $validated['end_date']);
                        });
                })
                ->whereIn('status', ['approved', 'pending'])
                ->first();

            if ($overlappingLeave) {
                $startDate = \Carbon\Carbon::parse($overlappingLeave->start_date)->format('Y-m-d');
                $endDate = \Carbon\Carbon::parse($overlappingLeave->end_date)->format('Y-m-d');

                return redirect()
                    ->back()
                    ->withErrors([
                        'start_date' => "Leave already applied for overlapping dates from {$startDate} to {$endDate}",
                    ]);
            }

            // Check if requested days exceed available balance
            $availableLeaves = $leaveType->max_days_per_year - $usedLeaves;
            if ($totalDays > $availableLeaves) {
                return redirect()
                    ->back()
                    ->withErrors([
                        'start_date' => __('Insufficient leave balance. Available: :available days, Requested: :requested days', [
                            'available' => $availableLeaves,
                            'requested' => $totalDays,
                        ]),
                    ]);
            }

            $leaveapplication->fill($validated);
            $leaveapplication->total_days = $totalDays;
            $leaveapplication->save();

            // Handle attachment updates
            if ($request->has('attachment_ids')) {
                $leaveapplication->syncAttachments($request->input('attachment_ids'));
            }

            UpdateLeaveApplication::dispatch($request, $leaveapplication);

            return redirect()->back()->with('success', __('The leaveapplication details are updated successfully.'));
        } else {
            return redirect()->route('hrm.leave-applications.index')->with('error', __('Permission denied'));
        }
    }

    public function destroy(LeaveApplication $leaveapplication)
    {
        if (Auth::user()->can('delete-leave-applications')) {
            DestroyLeaveApplication::dispatch($leaveapplication);
            $leaveapplication->delete();

            return redirect()->back()->with('success', __('The leaveapplication has been deleted.'));
        } else {
            return redirect()->route('hrm.leave-applications.index')->with('error', __('Permission denied'));
        }
    }

    public function updateStatus(Request $request, LeaveApplication $leaveapplication)
    {
        $request->validate([
            'status' => 'nullable|in:pending,approved,rejected',
            'manager_status' => 'nullable|in:pending,approved,rejected',
            'approver_comment' => 'nullable|string',
        ]);

        $isMultiTierEnabled = getCompanyAllSetting(creatorId())['enable_multi_tier_approval'] ?? 'on';

        // Manager Approval Flow
        if ($request->has('manager_status')) {
            $employee = Employee::where('user_id', $leaveapplication->employee_id)->first();
            
            // Check if auth user is the line manager OR a superadmin/admin bypassing
            if (Auth::user()->can('manage-any-leave-applications') || ($employee && $employee->line_manager == Auth::id())) {
                $leaveapplication->manager_status = $request->manager_status;
                $leaveapplication->manager_id = Auth::id();
                $leaveapplication->manager_comment = $request->has('status') ? $leaveapplication->manager_comment : $request->approver_comment;
                
                // If manager rejects, auto-reject the final status
                if ($request->manager_status === 'rejected') {
                    $leaveapplication->status = 'rejected';
                    $leaveapplication->approved_by = Auth::id();
                    $leaveapplication->approved_at = now();
                }
            } else {
                return redirect()->back()->with('error', __('Only line manager can update manager status.'));
            }
        }

        // HR Final Approval Flow
        if ($request->has('status')) {
            if (!Auth::user()->can('manage-leave-status')) {
                return redirect()->back()->with('error', __('Permission denied'));
            }

            if ($isMultiTierEnabled === 'on' && $leaveapplication->manager_status !== 'approved' && $request->status === 'approved') {
                return redirect()->back()->with('error', __('Leave must be approved by the line manager first.'));
            }

            $leaveapplication->status = $request->status;
            $leaveapplication->approver_comment = $request->approver_comment;

            if ($request->status === 'approved' || $request->status === 'rejected') {
                $leaveapplication->approved_by = Auth::id();
                $leaveapplication->approved_at = now();
            }
        }

        $leaveapplication->save();
        UpdateLeaveStatus::dispatch($request, $leaveapplication);

        return redirect()->back()->with('success', __('Leave status updated successfully.'));
    }

    public function destroyAttachment(TaskAttachment $attachment)
    {
        if (Auth::user()->can('edit-leave-applications')) {
            delete_file($attachment->file_path);
            $attachment->delete();

            return redirect()->back()->with('success', __('Attachment deleted successfully'));
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }

    public function getLeaveBalance($employeeId, $leaveTypeId)
    {
        if (Auth::user()->can('view-leave-applications')) {
            $leaveType = LeaveType::find($leaveTypeId);
            if (!$leaveType) {
                return response()->json(['error' => 'Invalid leave type'], 404);
            }

            $currentYear = date('Y');
            $baseQuery = LeaveApplication::where('employee_id', $employeeId)->where('leave_type_id', $leaveTypeId)->whereYear('start_date', $currentYear);

            // Exclude current leave application if editing
            if (request('exclude_id')) {
                $baseQuery->where('id', '!=', request('exclude_id'));
            }

            $approvedLeaves = (clone $baseQuery)->where('status', 'approved')->sum('total_days');
            $pendingLeaves = (clone $baseQuery)->where('status', 'pending')->sum('total_days');
            $usedLeaves = $approvedLeaves + $pendingLeaves;
            $availableLeaves = $leaveType->max_days_per_year - $usedLeaves;

            return response()->json([
                'total_leaves' => $leaveType->max_days_per_year,
                'approved_leaves' => $approvedLeaves,
                'pending_leaves' => $pendingLeaves,
                'used_leaves' => $usedLeaves,
                'available_leaves' => $availableLeaves,
            ]);
        } else {
            return response()->json([], 403);
        }
    }

    public function getLeaveTypesByEmployee($employeeId)
    {
        if (Auth::user()->can('view-leave_types')) {
            $leave_types = LeaveType::where('employee_id', $employeeId)->where('created_by', creatorId())->select('id', 'name')->get();

            return response()->json($leave_types);
        } else {
            return response()->json([], 403);
        }
    }

    private function getFilteredEmployees()
    {
        $employeeQuery = Employee::where('created_by', creatorId());

        if (Auth::user()->can('manage-own-leave-applications') && !Auth::user()->can('manage-any-leave-applications')) {
            $employeeQuery->where(function ($q) {
                $q->where('creator_id', Auth::id())->orWhere('user_id', Auth::id());
            });
        }

        return User::emp()->where('created_by', creatorId())
            ->whereIn('id', $employeeQuery->pluck('user_id'))
            ->select('id', 'name')->get();
    }
}
