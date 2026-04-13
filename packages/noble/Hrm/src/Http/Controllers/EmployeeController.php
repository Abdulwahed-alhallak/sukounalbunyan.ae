<?php

namespace Noble\Hrm\Http\Controllers;

use Noble\Hrm\Models\Employee;
use Noble\Hrm\Http\Requests\StoreEmployeeRequest;
use Noble\Hrm\Http\Requests\UpdateEmployeeRequest;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Noble\Hrm\Models\Branch;
use Noble\Hrm\Models\Department;
use Noble\Hrm\Models\Designation;
use Noble\Hrm\Models\EmployeeDocumentType;
use Noble\Hrm\Models\EmployeeDocument;
use Noble\Hrm\Models\Shift;
use Noble\Hrm\Events\CreateEmployee;
use Noble\Hrm\Events\DestroyEmployee;
use Noble\Hrm\Events\UpdateEmployee;
use Noble\Taskly\Models\TaskAttachment;
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

            $attendances = \Noble\Hrm\Models\Attendance::where('employee_id', $employee->user_id)->latest()->limit(30)->get();
            $leaveApplications = \Noble\Hrm\Models\LeaveApplication::with('leaveType')->where('employee_id', $employee->user_id)->latest()->get();
            $assets = \Noble\Hrm\Models\CompanyAsset::where('assigned_to', $employee->user_id)->latest()->get();
            $violations = \Noble\Hrm\Models\EmployeeViolation::with('violationType')->where('employee_id', $employee->user_id)->latest()->get();
            $onboardings = \Noble\Hrm\Models\EmployeeOnboarding::where('employee_id', $employee->user_id)->latest()->get();
            $contracts = \Noble\Hrm\Models\EmployeeContract::where('employee_id', $employee->user_id)->latest()->get();
            
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

    public function import(Request $request)
    {
        if (!Auth::user()->can('create-employees')) {
            return redirect()->route('hrm.employees.index')->with('error', __('Permission denied'));
        }

        $request->validate([
            'file' => 'required|mimes:csv,txt|max:20480',
        ]);

        $file = $request->file('file');
        $filePath = $file->getRealPath();

        $fileHandle = fopen($filePath, 'r');
        $bom = fread($fileHandle, 3);
        if ($bom !== "\xef\xbb\xbf") {
            rewind($fileHandle);
        }

        $headers = fgetcsv($fileHandle, 10000, ',');
        $headers = array_map('trim', $headers);

        $creatorId = creatorId();
        $added = 0;
        $updated = 0;

        DB::beginTransaction();
        try {
            while (($row = fgetcsv($fileHandle, 10000, ',')) !== false) {
                if(count($headers) !== count($row)) continue;
                
                $data = array_combine($headers, $row);
                
                $applicationId = trim($data['Application ID'] ?? '');
                $iqamaNo = trim($data['ID/Iqama No.'] ?? '');
                $name = trim($data['Name'] ?? '');
                
                if (empty($name)) continue;

                $email = trim($data['Email Address'] ?? '');
                if(empty($email) || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
                    $email = 'emp_' . strtolower(\Illuminate\Support\Str::random(6)) . '@' . parse_url(url('/'), PHP_URL_HOST);
                }

                $deptName = trim($data['Department'] ?? '');
                $departmentId = null;
                $branchId = null;
                if (!empty($deptName)) {
                    $parts = array_map('trim', explode('/', $deptName));
                    $branchName = count($parts) > 1 ? $parts[0] : 'Main Branch';
                    $cleanDeptName = count($parts) > 1 ? $parts[1] : $deptName;

                    $branch = Branch::firstOrCreate(
                        ['branch_name' => $branchName, 'created_by' => $creatorId],
                        ['created_by' => $creatorId]
                    );
                    $branchId = $branch->id;

                    $department = Department::firstOrCreate(
                        ['department_name' => $cleanDeptName, 'branch_id' => $branchId, 'created_by' => $creatorId],
                        ['created_by' => $creatorId]
                    );
                    $departmentId = $department->id;
                }

                $jobTitle = trim($data['Job Title'] ?? '');
                if(empty($jobTitle)) $jobTitle = trim($data['Occupation'] ?? 'Employee');
                $designationId = null;
                if (!empty($jobTitle) && $departmentId) {
                    $designation = Designation::firstOrCreate(
                        ['designation_name' => $jobTitle, 'department_id' => $departmentId, 'created_by' => $creatorId],
                        ['branch_id' => $branchId, 'created_by' => $creatorId]
                    );
                    $designationId = $designation->id;
                }

                $existingEmployee = Employee::where('created_by', $creatorId)
                    ->where(function ($q) use ($applicationId, $iqamaNo) {
                        if(!empty($applicationId)) $q->orWhere('application_id', $applicationId);
                        if(!empty($iqamaNo) && $iqamaNo != 'n/a') $q->orWhere('iqama_no', $iqamaNo);
                    })->first();

                $dbUser = null;
                if ($existingEmployee) {
                    $dbUser = User::find($existingEmployee->user_id);
                }

                if (!$dbUser) {
                    $dbUser = User::create([
                        'name' => $name,
                        'email' => $email,
                        'password' => Hash::make('123456'),
                        'type' => 'employee',
                        'lang' => 'en',
                        'created_by' => $creatorId,
                    ]);
                    $dbUser->assignRole('employee');
                } else {
                    $dbUser->update(['name' => $name]);
                }

                $parseBoolean = function($val) {
                    $val = strtoupper(trim($val));
                    return ($val === 'TRUE' || $val === '1' || $val === 'YES') ? 1 : 0;
                };

                $parseDate = function($val) {
                    $val = trim($val);
                    if(empty($val) || $val == 'N/A' || $val == 'n/a') return null;
                    try { return \Carbon\Carbon::parse($val)->format('Y-m-d'); } catch(\Exception $e) { return null; }
                };

                $empData = [
                    'user_id' => $dbUser->id,
                    'employee_id' => trim($data['Employee  ID'] ?? '') ?: Employee::generateEmployeeId(),
                    'application_id' => $applicationId,
                    'name_ar' => trim($data['Name (Ar)'] ?? ''),
                    'date_of_birth' => $parseDate($data['Birthdate'] ?? null),
                    'gender' => strtolower(trim($data['Gender'] ?? '')) == 'female' ? 'Female' : 'Male',
                    'nationality' => trim($data['Nationality'] ?? ''),
                    'marital_status' => trim($data['Marital Status'] ?? ''),
                    'marital_status2' => trim($data['Marital Status2'] ?? ''),
                    'place_of_birth' => trim($data['Place of Birth'] ?? ''),
                    'religion' => trim($data['Religion'] ?? ''),
                    'no_of_dependents' => trim($data['No. of Dependents'] ?? ''),
                    'blood_type' => trim($data['Blood Type'] ?? ''),
                    'mobile_no' => trim($data['Mobile No.'] ?? ''),
                    'alternate_mobile_no' => trim($data['Alternate Mobile No.'] ?? ''),
                    'email_address' => $email,
                    'work_email' => trim($data['Work Email'] ?? ''),
                    'place_of_residence' => trim($data['Place of residence'] ?? ''),
                    'resident_type' => trim($data['Resident Type'] ?? ''),
                    'address_line_1' => trim($data['Address'] ?? ''),
                    'iqama_no' => $iqamaNo,
                    'passport_no' => trim($data['Passport No.'] ?? ''),
                    'iqama_issue_date' => $parseDate($data['Iqama Issue Date'] ?? null),
                    'iqama_expiry_date' => $parseDate($data['Iqama Expiry Date'] ?? null),
                    'passport_expiry_date' => $parseDate($data['Passport Expiry Date'] ?? null),
                    'employer_number' => trim($data['Employer Number'] ?? ''),
                    'occupation' => trim($data['Occupation'] ?? ''),
                    'job_title' => $jobTitle,
                    'job_title_ar' => trim($data['JOP Title Arabic'] ?? ''),
                    'allocated_area' => trim($data['Allocated Area'] ?? ''),
                    'line_manager' => trim($data['Line manager'] ?? ''),
                    'date_of_joining' => $parseDate($data['Joining Date'] ?? null),
                    'gosi_joining_date' => $parseDate($data['تاريخ الإلتحاق حسب التامينات'] ?? null),
                    'employment_type' => trim($data['Employment Type'] ?? 'Full Time'),
                    'employee_status' => trim($data['Statue'] ?? 'Active'),
                    'oct_active' => $parseBoolean($data['OCT ACTIVE'] ?? 'FALSE'),
                    'jisr_active' => $parseBoolean($data['JISR'] ?? 'FALSE'),
                    'list_type' => trim($data['List'] ?? ''),
                    'notes' => trim($data['Note'] ?? ''),
                    'insurance_status' => trim($data['Insurance Status'] ?? ''),
                    'insurance_class' => trim($data['Insurance Class'] ?? ''),
                    'sponsor_id' => trim($data['Sponsor ID'] ?? ''),
                    'basic_salary' => (float) str_replace(',', '', trim($data['Total Salary'] ?? '0')),
                    'payment_method' => trim($data['Payment Method'] ?? 'Bank Transfer'),
                    'bank_name' => trim($data['Bank Name'] ?? ''),
                    'account_holder_name' => trim($data['Account Holder Name'] ?? ''),
                    'bank_iban' => trim($data['Bank IBAN No'] ?? ''),
                    'swift_code' => trim($data['SWIFT Code'] ?? ''),
                    'education_level' => trim($data['Education Level'] ?? ''),
                    'university' => trim($data['University/Institution'] ?? ''),
                    'major_field' => trim($data['Major / Field of Study'] ?? ''),
                    'graduation_year' => trim($data['Graduation Year'] ?? ''),
                    'total_experience_years' => trim($data['Total Years of Experience'] ?? ''),
                    'computer_skills' => trim($data['Computer Skills Level'] ?? ''),
                    'english_level' => trim($data['English Level'] ?? ''),
                    'arabic_level' => trim($data['Arabic Level'] ?? ''),
                    'other_languages' => trim($data['Other Languages'] ?? ''),
                    'branch_id' => $branchId,
                    'department_id' => $departmentId,
                    'designation_id' => $designationId,
                    'creator_id' => Auth::id(),
                    'created_by' => $creatorId,
                ];

                if ($existingEmployee) {
                    $existingEmployee->update($empData);
                    $updated++;
                } else {
                    $emp = new Employee();
                    $emp->fill($empData);
                    $emp->save();
                    CreateEmployee::dispatch($request, $emp);
                    $added++;
                }
            }
            fclose($fileHandle);
            DB::commit();

            return redirect()->route('hrm.employees.index')->with('success', __('Import Successful. Added: ').$added.__(', Updated: ').$updated);
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($fileHandle) && is_resource($fileHandle)) fclose($fileHandle);
            return redirect()->route('hrm.employees.index')->with('error', __('Import Failed: ') . $e->getMessage());
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
