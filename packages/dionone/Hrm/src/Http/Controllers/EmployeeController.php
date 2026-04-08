<?php

namespace DionONE\Hrm\Http\Controllers;

use DionONE\Hrm\Models\Employee;
use DionONE\Hrm\Http\Requests\StoreEmployeeRequest;
use DionONE\Hrm\Http\Requests\UpdateEmployeeRequest;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use DionONE\Hrm\Models\Branch;
use DionONE\Hrm\Models\Department;
use DionONE\Hrm\Models\Designation;
use DionONE\Hrm\Models\EmployeeDocumentType;
use DionONE\Hrm\Models\EmployeeDocument;
use DionONE\Hrm\Models\Shift;
use DionONE\Hrm\Events\CreateEmployee;
use DionONE\Hrm\Events\DestroyEmployee;
use DionONE\Hrm\Events\UpdateEmployee;
use DionONE\Taskly\Models\TaskAttachment;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    private function checkEmployeeAccess(Employee $employee)
    {
        if(Auth::user()->can('manage-any-employees')) {
            return $employee->created_by == creatorId();
        } elseif(Auth::user()->can('manage-own-employees')) {
            return ($employee->creator_id == Auth::id() || $employee->user_id == Auth::id());
        }
        return false;
    }
    public function index(Request $request)
    {
        if (Auth::user()->can('manage-employees')) {
            $query = Employee::query()->with(['user:id,name,avatar,is_disable', 'branch', 'department', 'designation', 'shift']);

            $query->where(function ($q) {
                if (Auth::user()->can('manage-any-employees')) {
                    $q->where('created_by', creatorId());
                } elseif (Auth::user()->can('manage-own-employees')) {
                    $q->where('creator_id', Auth::id())->orWhere('user_id', Auth::id());
                } else {
                    $q->whereRaw('1 = 0');
                }
            });

            if ($request->filled('employee_id')) {
                $query->where(function ($q) use ($request) {
                    $q->where('employee_id', 'like', '%' . $request->employee_id . '%')
                      ->orWhereHas('user', function($userQuery) use ($request) {
                          $userQuery->where('name', 'like', '%' . $request->employee_id . '%');
                      });
                });
            }

            if ($request->filled('branch_id') && $request->branch_id !== 'all') {
                $query->where('branch_id', $request->branch_id);
            }

            if ($request->filled('department_id') && $request->department_id !== 'all') {
                $query->where('department_id', $request->department_id);
            }

            if ($request->filled('employment_type')) {
                $query->where('employment_type', $request->employment_type);
            }

            if ($request->filled('gender')) {
                $query->where('gender', $request->gender);
            }

            if ($request->filled('sort')) {
                $query->orderBy($request->sort, $request->input('direction', 'asc'));
            } else {
                $query->latest();
            }

            $employees = $query->paginate($request->input('per_page', 10))->withQueryString();

            return Inertia::render('Hrm/Employees/Index', [
                'employees' => $employees,
                'users' => User::emp()->where('created_by', creatorId())->select('id', 'name')->get(),
                'branches' => Branch::where('created_by', creatorId())->select('id', 'branch_name')->get(),
                'departments' => Department::where('created_by', creatorId())->select('id', 'department_name', 'branch_id')->get(),
                'designations' => Designation::where('created_by', creatorId())->select('id', 'designation_name', 'branch_id', 'department_id')->get(),
                'shifts' => Shift::where('created_by', creatorId())->select('id', 'shift_name')->get(),
            ]);
        } else {
            return back()->with('error', __('Permission denied'));
        }
    }

    public function create()
    {
        if (Auth::user()->can('create-employees')) {
            return Inertia::render('Hrm/Employees/Create', [
                'users' => User::emp()->where('created_by', creatorId())->whereNotIn('id', Employee::where('created_by', creatorId())->pluck('user_id'))->select('id', 'name')->get(),
                'branches' => Branch::where('created_by', creatorId())->select('id', 'branch_name')->get(),
                'departments' => Department::where('created_by', creatorId())->select('id', 'department_name', 'branch_id')->get(),
                'designations' => Designation::where('created_by', creatorId())->select('id', 'designation_name', 'branch_id', 'department_id')->get(),
                'shifts' => Shift::where('created_by', creatorId())->select('id', 'shift_name')->get(),
                'documentTypes' => EmployeeDocumentType::where('created_by', creatorId())->select('id', 'document_name', 'is_required')->get(),
                'generatedEmployeeId' => Employee::generateEmployeeId(),
            ]);
        } else {
            return redirect()->route('hrm.employees.index')->with('error', __('Permission denied'));
        }
    }

    public function store(StoreEmployeeRequest $request)
    {
        if (Auth::user()->can('create-employees')) {
            $validated = $request->validated();
            $employeeData = collect($validated)->except(['documents'])->toArray();
            
            $employee = new Employee();
            $employee->fill($employeeData);
            $employee->shift = $validated['shift_id'];
            $employee->creator_id = Auth::id();
            $employee->created_by = creatorId();
            $employee->save();

            CreateEmployee::dispatch($request, $employee);

            // Store attachments
            if ($request->has('attachment_ids')) {
                $employee->syncAttachments($request->input('attachment_ids'));
            }

            return redirect()->route('hrm.employees.index')->with('success', __('The employee has been created successfully.'));
        } else {
            return redirect()->route('hrm.employees.index')->with('error', __('Permission denied'));
        }
    }

    public function edit(Employee $employee)
    {
        if (Auth::user()->can('edit-employees')) {
            if(!$this->checkEmployeeAccess($employee)) {
                return redirect()->route('hrm.employees.index')->with('error', __('Permission denied'));
            }
            $employee->load('attachments.uploader:id,name');

            return Inertia::render('Hrm/Employees/Edit', [
                'employee' => $employee,
                'users' => User::emp()->where('created_by', creatorId())->select('id', 'name')->get(),
                'branches' => Branch::where('created_by', creatorId())->select('id', 'branch_name')->get(),
                'departments' => Department::where('created_by', creatorId())->select('id', 'department_name', 'branch_id')->get(),
                'designations' => Designation::where('created_by', creatorId())->select('id', 'designation_name', 'branch_id', 'department_id')->get(),
                'shifts' => Shift::where('created_by', creatorId())->select('id', 'shift_name')->get(),
            ]);
        } else {
            return redirect()->route('hrm.employees.index')->with('error', __('Permission denied'));
        }
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    { 
        if (Auth::user()->can('edit-employees')) {
            $validated = $request->validated();
            $employeeData = collect($validated)->except(['documents'])->toArray();
            
            $employee->fill($employeeData);
            $employee->shift = $validated['shift_id'];
            $employee->save();

            UpdateEmployee::dispatch($request, $employee);

            // Handle attachment updates
            if ($request->has('attachment_ids')) {
                $employee->syncAttachments($request->input('attachment_ids'));
            }

            return redirect()->route('hrm.employees.index')->with('success', __('The employee details are updated successfully.'));
        } else {
            return redirect()->route('hrm.employees.index')->with('error', __('Permission denied'));
        }
    }

    public function destroy(Employee $employee)
    {
        if (Auth::user()->can('delete-employees')) {
            DestroyEmployee::dispatch($employee);
            $employee->delete();

            return redirect()->back()->with('success', __('The employee has been deleted.'));
        } else {
            return redirect()->route('hrm.employees.index')->with('error', __('Permission denied'));
        }
    }

    public function show(Employee $employee)
    {
        if (Auth::user()->can('view-employees')) {
            if(!$this->checkEmployeeAccess($employee)) {
                return redirect()->route('hrm.employees.index')->with('error', __('Permission denied'));
            }
            $employee->load([
                'user:id,name,email,avatar', 
                'branch', 
                'department', 
                'designation', 
                'shift',
                'attachments.uploader:id,name'
            ]);

            $attendances = \DionONE\Hrm\Models\Attendance::where('employee_id', $employee->user_id)->latest()->limit(30)->get();
            $leaveApplications = \DionONE\Hrm\Models\LeaveApplication::with('leaveType')->where('employee_id', $employee->user_id)->latest()->get();
            $assets = \DionONE\Hrm\Models\CompanyAsset::where('assigned_to', $employee->user_id)->latest()->get();
            $violations = \DionONE\Hrm\Models\EmployeeViolation::with('violationType')->where('employee_id', $employee->user_id)->latest()->get();
            $onboardings = \DionONE\Hrm\Models\EmployeeOnboarding::where('employee_id', $employee->user_id)->latest()->get();
            $contracts = \DionONE\Hrm\Models\EmployeeContract::where('employee_id', $employee->user_id)->latest()->get();
            
            return Inertia::render('Hrm/Employees/Show', [
                'employee' => $employee,
                'attendances' => $attendances,
                'leaveApplications' => $leaveApplications,
                'assets' => $assets,
                'violations' => $violations,
                'onboardings' => $onboardings,
                'contracts' => $contracts,
            ]);
        } else {
            return redirect()->route('hrm.employees.index')->with('error', __('Permission denied'));
        }
    }

    public function expiries()
    {
        if (Auth::user()->can('manage-employees')) {
            $thirtyDaysFromNow = now()->addDays(30)->toDateString();
            $sixtyDaysFromNow = now()->addDays(60)->toDateString();
            
            $expiringIqamas = Employee::with('user:id,name')
                ->where('created_by', creatorId())
                ->whereNotNull('iqama_expiry_date')
                ->where('iqama_expiry_date', '<=', $sixtyDaysFromNow)
                ->orderBy('iqama_expiry_date', 'asc')
                ->get();
                
            $expiringPassports = Employee::with('user:id,name')
                ->where('created_by', creatorId())
                ->whereNotNull('passport_expiry_date')
                ->where('passport_expiry_date', '<=', $sixtyDaysFromNow)
                ->orderBy('passport_expiry_date', 'asc')
                ->get();

            return Inertia::render('Hrm/Employees/Expiries', [
                'expiringIqamas' => $expiringIqamas,
                'expiringPassports' => $expiringPassports,
            ]);
        } else {
            return redirect()->route('hrm.employees.index')->with('error', __('Permission denied'));
        }
    }

    // More actions
    public function destroyAttachment(TaskAttachment $attachment)
    {
        if (Auth::user()->can('edit-employees')) {
            delete_file($attachment->file_path);
            $attachment->delete();

            return redirect()->back()->with('success', __('Attachment deleted successfully'));
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }

    public function deleteDocument($employeeId, EmployeeDocument $document)
    {
        if (Auth::user()->can('edit-employees')) {
            if ($document->user_id != $employeeId) {
                return redirect()->back()->with('error', __('Document not found'));
            }

            delete_file($document->file_path);
            $document->delete();

            return redirect()->back()->with('success', __('Document deleted successfully'));
        } else {
            return redirect()->back()->with('error', __('Permission denied'));
        }
    }
}
