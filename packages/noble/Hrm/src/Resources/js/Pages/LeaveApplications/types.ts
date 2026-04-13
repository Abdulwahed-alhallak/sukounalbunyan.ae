import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface User {
    id: number;
    name: string;
    [key: string]: any;
}

export interface LeaveType {
    id: number;
    name: string;
    is_paid?: boolean;
    color?: string;
    [key: string]: any;
}

export interface Employee {
    id: number;
    name?: string;
    user?: User;
    [key: string]: any;
}

export interface LeaveApplication {
    id: number;
    start_date: string;
    end_date: string;
    total_days: number;
    reason: string;
    attachment?: string;
    attachments?: any[];
    status: string;
    approver_comment?: string;
    approved_at?: any;
    employee_id?: number;
    employee?: User;
    leave_type_id?: number;
    leave_type?: LeaveType;
    approved_by?: number;
    manager_status?: string;
    manager_comment?: string;
    is_line_manager?: boolean;
    [key: string]: any;
}

export interface CreateLeaveApplicationFormData {
    employee_id: string;
    leave_type_id: string;
    start_date: string;
    end_date: string;
    reason: string;
    attachment_ids: string[];
    sync_to_google_calendar?: boolean;
    [key: string]: any;
}

export interface EditLeaveApplicationFormData {
    employee_id: string;
    leave_type_id: string;
    start_date: string;
    end_date: string;
    reason: string;
    attachment_ids: string[];
    [key: string]: any;
}

export interface LeaveApplicationFilters {
    reason: string;
    status: string;
    employee_id: string;
    start_date: string;
    end_date: string;
    [key: string]: any;
}

export type PaginatedLeaveApplications = PaginatedData<LeaveApplication>;
export type LeaveApplicationModalState = ModalState<LeaveApplication>;

export interface LeaveApplicationsIndexProps {
    leaveapplications: PaginatedLeaveApplications;
    auth: AuthContext;
    users: any[];
    leavetypes: any[];
    employees: Employee[];
    isMultiTierEnabled?: boolean;
    [key: string]: any;
}

export interface CreateLeaveApplicationProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditLeaveApplicationProps {
    leaveapplication: LeaveApplication;
    onSuccess: () => void;
    [key: string]: any;
}

export interface LeaveApplicationShowProps {
    leaveapplication: LeaveApplication;
    [key: string]: any;
}