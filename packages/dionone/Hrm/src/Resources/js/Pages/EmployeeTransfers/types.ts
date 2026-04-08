import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface User {
    id: number;
    name: string;
    [key: string]: any;
}

export interface Branch {
    id: number;
    name: string;
    [key: string]: any;
}

export interface Department {
    id: number;
    name: string;
    [key: string]: any;
}

export interface Designation {
    id: number;
    name: string;
    [key: string]: any;
}

export interface EmployeeTransfer {
    id: number;
    transfer_date?: string;
    effective_date: string;
    reason?: string;
    status: string;
    document?: string;
    employee_id?: number;
    employee?: User;
    from_branch_id?: number;
    from_branch?: Branch;
    from_department_id?: number;
    from_department?: Department;
    from_designation_id?: number;
    from_designation?: Designation;
    to_branch_id?: number;
    to_branch?: Branch;
    to_department_id?: number;
    to_department?: Department;
    to_designation_id?: number;
    to_designation?: Designation;
    approved_by?: any;
    created_at: string;
    [key: string]: any;
}

export interface CreateEmployeeTransferFormData {
    transfer_date: string;
    effective_date: string;
    reason: string;
    status: string;
    document: string;
    employee_id: string;
    from_branch_id: string;
    from_department_id: string;
    from_designation_id: string;
    to_branch_id: string;
    to_department_id: string;
    to_designation_id: string;
    approved_by: string;
    [key: string]: any;
}

export interface EditEmployeeTransferFormData {
    transfer_date: string;
    effective_date: string;
    reason: string;
    status: string;
    document: string;
    employee_id: string;
    from_branch_id: string;
    from_department_id: string;
    from_designation_id: string;
    to_branch_id: string;
    to_department_id: string;
    to_designation_id: string;
    approved_by: string;
    [key: string]: any;
}

export interface EmployeeTransferFilters {
    search?: string;
    employee_id?: string;
    status?: string;
    [key: string]: any;
}

export type PaginatedEmployeeTransfers = PaginatedData<EmployeeTransfer>;
export type EmployeeTransferModalState = { isOpen: boolean; mode: string; data: EmployeeTransfer | null; };

export interface EmployeeTransfersIndexProps {
    employeetransfers: PaginatedEmployeeTransfers;
    auth: AuthContext;
    users: any[];
    branches: any[];
    departments: any[];
    designations: any[];
    [key: string]: any;
}

export interface CreateEmployeeTransferProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditEmployeeTransferProps {
    employeetransfer: EmployeeTransfer;
    onSuccess: () => void;
    [key: string]: any;
}

export interface EmployeeTransferShowProps {
    employeetransfer: EmployeeTransfer;
    [key: string]: any;
}