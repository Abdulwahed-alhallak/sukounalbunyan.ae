<?php

namespace DionONE\Hrm\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'application_id' => 'nullable|max:50',
            'name_ar' => 'nullable|max:255',
            'date_of_birth' => 'required|date',
            'gender' => 'required',
            'shift_id' => 'required|exists:shifts,id',
            'date_of_joining' => 'required|date',
            'employment_type' => 'required',
            // Personal
            'nationality' => 'nullable|max:100',
            'marital_status' => 'nullable|max:50',
            'marital_status2' => 'nullable|max:50',
            'place_of_birth' => 'nullable|max:100',
            'religion' => 'nullable|max:50',
            'no_of_dependents' => 'nullable|integer|min:0',
            'blood_type' => 'nullable|max:10',
            // Contact
            'mobile_no' => 'nullable|max:20',
            'alternate_mobile_no' => 'nullable|max:20',
            'email_address' => 'nullable|email|max:255',
            'work_email' => 'nullable|email|max:255',
            'place_of_residence' => 'nullable|max:255',
            'resident_type' => 'nullable|max:100',
            'address_line_1' => 'nullable|max:255',
            'address_line_2' => 'nullable|max:255',
            'city' => 'nullable|max:100',
            'state' => 'nullable|max:100',
            'country' => 'nullable|max:100',
            'postal_code' => 'nullable|max:20',
            // Identity
            'iqama_no' => 'nullable|max:50',
            'passport_no' => 'nullable|max:50',
            'iqama_issue_date' => 'nullable|date',
            'iqama_expiry_date' => 'nullable|date',
            'passport_expiry_date' => 'nullable|date',
            // Emergency
            'emergency_contact_name' => 'nullable|max:100',
            'emergency_contact_relationship' => 'nullable|max:100',
            'emergency_contact_number' => 'nullable|max:20',
            // Employment
            'employer_number' => 'nullable|max:50',
            'occupation' => 'nullable|max:100',
            'job_title' => 'nullable|max:255',
            'job_title_ar' => 'nullable|max:255',
            'allocated_area' => 'nullable|max:255',
            'line_manager' => 'nullable|max:255',
            'gosi_joining_date' => 'nullable|date',
            'employee_status' => 'nullable|max:50',
            'list_type' => 'nullable|max:50',
            'notes' => 'nullable|max:1000',
            // Insurance
            'insurance_status' => 'nullable|max:50',
            'insurance_class' => 'nullable|max:10',
            'sponsor_id' => 'nullable|max:50',
            // Banking
            'bank_name' => 'nullable|max:100',
            'account_holder_name' => 'nullable|max:100',
            'account_number' => 'nullable|max:50',
            'bank_identifier_code' => 'nullable|max:50',
            'bank_branch' => 'nullable|max:100',
            'bank_iban' => 'nullable|max:50',
            'swift_code' => 'nullable|max:20',
            'tax_payer_id' => 'nullable|max:50',
            'basic_salary' => 'nullable|numeric|min:0',
            'payment_method' => 'nullable|max:50',
            'hours_per_day' => 'nullable|numeric|min:0|max:24',
            'days_per_week' => 'nullable|numeric|min:0|max:7',
            'rate_per_hour' => 'nullable|numeric|min:0',
            // Education
            'education_level' => 'nullable|max:100',
            'university' => 'nullable|max:255',
            'major_field' => 'nullable|max:255',
            'graduation_year' => 'nullable|max:10',
            'total_experience_years' => 'nullable|integer|min:0',
            'computer_skills' => 'nullable|max:255',
            'english_level' => 'nullable|max:50',
            'arabic_level' => 'nullable|max:50',
            'other_languages' => 'nullable|max:255',
            // Relations
            'branch_id' => 'required|exists:branches,id',
            'department_id' => 'required|exists:departments,id',
            'designation_id' => 'required|exists:designations,id',
            'documents' => 'nullable|array',
            'documents.*.document_type_id' => 'nullable|exists:employee_document_types,id',
            'documents.*.file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
        ];
    }
}