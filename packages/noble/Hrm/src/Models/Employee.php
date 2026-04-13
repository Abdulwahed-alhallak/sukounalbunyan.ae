<?php

namespace Noble\Hrm\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use Noble\Hrm\Models\Branch;
use Noble\Hrm\Models\Department;
use Noble\Hrm\Models\Designation;
use Noble\Taskly\Traits\InteractsWithMedia;
use Noble\Taskly\Models\TaskAttachment;

class Employee extends Model
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'employee_id',
        'application_id',
        'name_ar',
        'date_of_birth',
        'gender',
        'shift_id',
        'date_of_joining',
        'employment_type',
        // Personal
        'nationality',
        'marital_status',
        'marital_status2',
        'place_of_birth',
        'religion',
        'no_of_dependents',
        'blood_type',
        // Contact
        'mobile_no',
        'alternate_mobile_no',
        'email_address',
        'work_email',
        'place_of_residence',
        'resident_type',
        // Address
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'country',
        'postal_code',
        // Identity Documents
        'iqama_no',
        'passport_no',
        'iqama_issue_date',
        'iqama_expiry_date',
        'passport_expiry_date',
        // Employment
        'employer_number',
        'occupation',
        'job_title',
        'job_title_ar',
        'allocated_area',
        'line_manager',
        'gosi_joining_date',
        // Status
        'employee_status',
        'oct_active',
        'jisr_active',
        'list_type',
        'notes',
        // Insurance
        'insurance_status',
        'insurance_class',
        'sponsor_id',
        // Emergency
        'emergency_contact_name',
        'emergency_contact_relationship',
        'emergency_contact_number',
        // Bank & Salary
        'bank_name',
        'account_holder_name',
        'account_number',
        'bank_identifier_code',
        'bank_branch',
        'bank_iban',
        'swift_code',
        'tax_payer_id',
        'basic_salary',
        'payment_method',
        'hours_per_day',
        'days_per_week',
        'rate_per_hour',
        // Education
        'education_level',
        'university',
        'major_field',
        'graduation_year',
        'total_experience_years',
        // Skills
        'computer_skills',
        'english_level',
        'arabic_level',
        'other_languages',
        // Relations
        'user_id',
        'branch_id',
        'department_id',
        'designation_id',
        'creator_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'date_of_joining' => 'date',
            'iqama_issue_date' => 'date',
            'iqama_expiry_date' => 'date',
            'passport_expiry_date' => 'date',
            'gosi_joining_date' => 'date',
            'oct_active' => 'boolean',
            'jisr_active' => 'boolean',
            'basic_salary' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class, 'shift_id', 'id');
    }

    public function lineManager()
    {
        return $this->belongsTo(User::class, 'line_manager', 'id');
    }

    public function subordinates()
    {
        return $this->hasMany(self::class, 'line_manager', 'user_id')
            ->where('created_by', $this->created_by ?? creatorId());
    }

    public static function generateEmployeeId()
    {
        $prefix = 'EMP';
        $year = date('Y');
        $lastEmployee = self::where('employee_id', 'like', $prefix . $year . '%')
            ->orderBy('employee_id', 'desc')
            ->first();

        if ($lastEmployee) {
            $lastNumber = (int) substr($lastEmployee->employee_id, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . $year . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }

    public function getStatusBadgeAttribute()
    {
        $statusMap = [
            'Active' => 'success',
            'RESIGNED' => 'danger',
            'TERMINATED' => 'danger',
            'CASH' => 'warning',
            'BANK TRANSFER' => 'info',
            'MOVED' => 'warning',
        ];
        return $statusMap[$this->employee_status] ?? 'secondary';
    }
}
