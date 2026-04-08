import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface Department {
    id: number;
    department_name: string;
    branch_id?: number;
    branch?: Branch;
    created_at: string;
    [key: string]: any;
}

export interface DepartmentFormData {
    department_name: string;
    branch_id: string;
    [key: string]: any;
}

export interface CreateDepartmentProps extends CreateProps  {
    branches: any[];
    [key: string]: any;
}

export interface EditDepartmentProps extends EditProps<Department>  {
    branches: any[];
    [key: string]: any;
}

export type PaginatedDepartments = PaginatedData<Department>;
export type DepartmentModalState = ModalState<Department>;

export interface DepartmentsIndexProps {
    departments: PaginatedDepartments;
    auth: AuthContext;
    branches: any[];
    [key: string]: any;
}