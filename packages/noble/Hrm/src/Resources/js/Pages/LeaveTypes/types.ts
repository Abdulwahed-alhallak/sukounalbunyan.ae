import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface LeaveType {
    id: number;
    name: string;
    description?: string;
    max_days_per_year: number;
    is_paid: boolean;
    color: any;
    created_at: string;
    [key: string]: any;
}

export interface CreateLeaveTypeFormData {
    name: string;
    description: string;
    max_days_per_year: string;
    is_paid: boolean;
    color: any;
    [key: string]: any;
}

export interface EditLeaveTypeFormData {
    name: string;
    description: string;
    max_days_per_year: string;
    is_paid: boolean;
    color: any;
    [key: string]: any;
}

export interface LeaveTypeFilters {
    name: string;
    is_paid: string;
    [key: string]: any;
}

export type PaginatedLeaveTypes = PaginatedData<LeaveType>;
export type LeaveTypeModalState = ModalState<LeaveType>;

export interface LeaveTypesIndexProps {
    leavetypes: PaginatedLeaveTypes;
    auth: AuthContext;
    [key: string]: any;
}

export interface CreateLeaveTypeProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditLeaveTypeProps {
    leavetype: LeaveType;
    onSuccess: () => void;
    [key: string]: any;
}

export interface LeaveTypeShowProps {
    leavetype: LeaveType;
    [key: string]: any;
}
