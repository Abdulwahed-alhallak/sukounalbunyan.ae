import { PaginatedData, ModalState, AuthContext } from '@/types/common';



export interface Payroll {
    id: number;
    title: string;
    payroll_frequency: string;
    pay_period_start: string;
    pay_period_end: string;
    pay_date: string;
    notes?: string;
    total_gross_pay?: number;
    total_deductions?: number;
    total_net_pay?: number;
    employee_count?: number;
    status: string;
    is_payroll_paid?: string;
    payroll_id?: string;
    created_at: string;
    [key: string]: any;
}

export interface CreatePayrollFormData {
    title: string;
    payroll_frequency: string;
    pay_period_start: string;
    pay_period_end: string;
    pay_date: string;
    notes: string;
    total_gross_pay: string;
    total_deductions: string;
    total_net_pay: string;
    employee_count: string;
    status: string;
    [key: string]: any;
}

export interface EditPayrollFormData {
    title: string;
    payroll_frequency: string;
    pay_period_start: string;
    pay_period_end: string;
    pay_date: string;
    notes: string;
    total_gross_pay: string;
    total_deductions: string;
    total_net_pay: string;
    employee_count: string;
    status: string;
    [key: string]: any;
}

export interface PayrollFilters {
    title: string;
    payroll_frequency: string;
    status: string;
    [key: string]: any;
}

export type PaginatedPayrolls = PaginatedData<Payroll>;
export type PayrollModalState = ModalState<Payroll>;

export interface PayrollsIndexProps {
    payrolls: PaginatedPayrolls;
    auth: AuthContext;
    [key: string]: any;
}

export interface CreatePayrollProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditPayrollProps {
    payroll: Payroll;
    onSuccess: () => void;
    [key: string]: any;
}

export interface PayrollShowProps {
    payroll: Payroll;
    [key: string]: any;
}