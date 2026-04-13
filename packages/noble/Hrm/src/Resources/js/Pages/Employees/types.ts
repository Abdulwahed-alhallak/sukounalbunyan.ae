import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface Branch {
    id: number;
    name: string;
    branch_name?: string;
    [key: string]: any;
}

export interface Department {
    id: number;
    name: string;
    department_name?: string;
    [key: string]: any;
}

export interface User {
    id: number;
    name: string;
    email?: string;
    avatar?: string;
    is_disable?: number;
    [key: string]: any;
}

export interface Designation {
    id: number;
    name: string;
    designation_name?: string;
    [key: string]: any;
}

export interface Employee {
    id: number;
    employee_id: string;
    application_id?: string;
    name_ar?: string;
    date_of_birth?: string;
    gender: string;
    shift_id?: number;
    shift?: { id: number; shift_name: string; [key: string]: any };
    date_of_joining: string;
    employment_type: string;
    // Personal
    nationality?: string;
    marital_status?: string;
    marital_status2?: string;
    place_of_birth?: string;
    religion?: string;
    no_of_dependents?: number;
    blood_type?: string;
    // Contact
    mobile_no?: string;
    alternate_mobile_no?: string;
    email_address?: string;
    work_email?: string;
    place_of_residence?: string;
    resident_type?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    // Identity
    iqama_no?: string;
    passport_no?: string;
    iqama_issue_date?: string;
    iqama_expiry_date?: string;
    passport_expiry_date?: string;
    // Emergency
    emergency_contact_name?: string;
    emergency_contact_relationship?: string;
    emergency_contact_number?: string;
    // Employment
    employer_number?: string;
    occupation?: string;
    job_title?: string;
    job_title_ar?: string;
    allocated_area?: string;
    line_manager?: string;
    gosi_joining_date?: string;
    employee_status?: string;
    oct_active?: boolean;
    jisr_active?: boolean;
    list_type?: string;
    notes?: string;
    // Insurance
    insurance_status?: string;
    insurance_class?: string;
    sponsor_id?: string;
    // Banking
    bank_name?: string;
    account_holder_name?: string;
    account_number?: string;
    bank_identifier_code?: string;
    bank_branch?: string;
    bank_iban?: string;
    swift_code?: string;
    tax_payer_id?: string;
    basic_salary?: number;
    payment_method?: string;
    hours_per_day?: number;
    days_per_week?: number;
    rate_per_hour?: number;
    // Education
    education_level?: string;
    university?: string;
    major_field?: string;
    graduation_year?: string;
    total_experience_years?: number;
    computer_skills?: string;
    english_level?: string;
    arabic_level?: string;
    other_languages?: string;
    // Relations
    user_id?: number;
    user?: User;
    branch_id?: number;
    branch?: Branch;
    department_id?: number;
    department?: Department;
    designation_id?: number;
    designation?: Designation;
    attachments: any[];
    created_at: string;
}

export interface CreateEmployeeFormData {
    employee_id: string;
    name_ar: string;
    date_of_birth: string;
    gender: string;
    shift_id: string;
    date_of_joining: string;
    employment_type: string;
    // Personal
    nationality: string;
    marital_status: string;
    place_of_birth: string;
    religion: string;
    no_of_dependents: string;
    blood_type: string;
    // Contact
    mobile_no: string;
    alternate_mobile_no: string;
    email_address: string;
    work_email: string;
    place_of_residence: string;
    resident_type: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    // Identity
    iqama_no: string;
    passport_no: string;
    iqama_issue_date: string;
    iqama_expiry_date: string;
    passport_expiry_date: string;
    // Emergency
    emergency_contact_name: string;
    emergency_contact_relationship: string;
    emergency_contact_number: string;
    // Employment
    employer_number: string;
    occupation: string;
    job_title: string;
    job_title_ar: string;
    allocated_area: string;
    line_manager: string;
    gosi_joining_date: string;
    employee_status: string;
    list_type: string;
    notes: string;
    // Insurance
    insurance_status: string;
    insurance_class: string;
    sponsor_id: string;
    // Banking
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    bank_identifier_code: string;
    bank_branch: string;
    bank_iban: string;
    swift_code: string;
    tax_payer_id: string;
    basic_salary: string;
    payment_method: string;
    hours_per_day: string;
    days_per_week: string;
    rate_per_hour: string;
    // Education
    education_level: string;
    university: string;
    major_field: string;
    graduation_year: string;
    total_experience_years: string;
    computer_skills: string;
    english_level: string;
    arabic_level: string;
    other_languages: string;
    // Relations
    user_id: string;
    branch_id: string;
    department_id: string;
    designation_id: string;
    attachment_ids: number[];
    documents: any[];
    [key: string]: any;
}

export interface EditEmployeeFormData extends CreateEmployeeFormData {
    [key: string]: any;
}

export interface EmployeeFilters {
    employee_id: string;
    user_name: string;
    branch_id: string;
    department_id: string;
    employment_type: string;
    gender: string;
    [key: string]: any;
}

export type PaginatedEmployees = PaginatedData<Employee>;
export type EmployeeModalState = ModalState<Employee>;

export interface EmployeesIndexProps {
    employees: PaginatedEmployees;
    auth: AuthContext;
    users: any[];
    branches: any[];
    departments: any[];
    designations: any[];
    [key: string]: any;
}

export interface CreateEmployeeProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditEmployeeProps {
    employee: Employee;
    onSuccess: () => void;
    [key: string]: any;
}

export interface EmployeeShowProps {
    employee: Employee;
    [key: string]: any;
}
