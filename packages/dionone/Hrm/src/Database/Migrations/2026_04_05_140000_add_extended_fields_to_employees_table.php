<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            // Personal Information
            $table->string('name_ar')->nullable()->after('employee_id');
            $table->string('nationality')->nullable()->after('gender');
            $table->string('marital_status')->nullable()->after('nationality');
            $table->string('place_of_birth')->nullable()->after('marital_status');
            $table->string('religion')->nullable()->after('place_of_birth');
            $table->integer('no_of_dependents')->nullable()->after('religion');
            $table->string('blood_type')->nullable()->after('no_of_dependents');

            // Contact Information
            $table->string('mobile_no')->nullable()->after('blood_type');
            $table->string('alternate_mobile_no')->nullable()->after('mobile_no');
            $table->string('email_address')->nullable()->after('alternate_mobile_no');
            $table->string('work_email')->nullable()->after('email_address');
            $table->string('place_of_residence')->nullable()->after('work_email');
            $table->string('resident_type')->nullable()->after('place_of_residence');

            // Identity Documents
            $table->string('iqama_no')->nullable()->after('resident_type');
            $table->string('passport_no')->nullable()->after('iqama_no');
            $table->date('iqama_issue_date')->nullable()->after('passport_no');
            $table->date('iqama_expiry_date')->nullable()->after('iqama_issue_date');
            $table->date('passport_expiry_date')->nullable()->after('iqama_expiry_date');

            // Employment Details
            $table->string('employer_number')->nullable()->after('passport_expiry_date');
            $table->string('occupation')->nullable()->after('employer_number');
            $table->string('job_title')->nullable()->after('occupation');
            $table->string('job_title_ar')->nullable()->after('job_title');
            $table->string('allocated_area')->nullable()->after('job_title_ar');
            $table->string('line_manager')->nullable()->after('allocated_area');
            $table->date('gosi_joining_date')->nullable()->after('line_manager');

            // Status
            $table->string('employee_status')->default('Active')->after('gosi_joining_date');
            $table->boolean('oct_active')->default(false)->after('employee_status');
            $table->boolean('jisr_active')->default(false)->after('oct_active');
            $table->string('list_type')->nullable()->after('jisr_active');
            $table->text('notes')->nullable()->after('list_type');

            // Insurance
            $table->string('insurance_status')->nullable()->after('notes');
            $table->string('insurance_class')->nullable()->after('insurance_status');
            $table->string('sponsor_id')->nullable()->after('insurance_class');

            // Salary & Payment
            $table->string('payment_method')->nullable()->after('basic_salary');
            $table->string('bank_iban')->nullable()->after('payment_method');
            $table->string('swift_code')->nullable()->after('bank_iban');

            // Education
            $table->string('education_level')->nullable()->after('swift_code');
            $table->string('university')->nullable()->after('education_level');
            $table->string('major_field')->nullable()->after('university');
            $table->string('graduation_year')->nullable()->after('major_field');
            $table->integer('total_experience_years')->nullable()->after('graduation_year');

            // Skills
            $table->string('computer_skills')->nullable()->after('total_experience_years');
            $table->string('english_level')->nullable()->after('computer_skills');
            $table->string('arabic_level')->nullable()->after('english_level');
            $table->string('other_languages')->nullable()->after('arabic_level');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'name_ar', 'nationality', 'marital_status', 'place_of_birth',
                'religion', 'no_of_dependents', 'blood_type',
                'mobile_no', 'alternate_mobile_no', 'email_address', 'work_email',
                'place_of_residence', 'resident_type',
                'iqama_no', 'passport_no', 'iqama_issue_date', 'iqama_expiry_date', 'passport_expiry_date',
                'employer_number', 'occupation', 'job_title', 'job_title_ar',
                'allocated_area', 'line_manager', 'gosi_joining_date',
                'employee_status', 'oct_active', 'jisr_active', 'list_type', 'notes',
                'insurance_status', 'insurance_class', 'sponsor_id',
                'payment_method', 'bank_iban', 'swift_code',
                'education_level', 'university', 'major_field', 'graduation_year', 'total_experience_years',
                'computer_skills', 'english_level', 'arabic_level', 'other_languages',
            ]);
        });
    }
};
