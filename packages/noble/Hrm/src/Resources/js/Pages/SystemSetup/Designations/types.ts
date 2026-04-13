import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface Designation {
    id: number;
    designation_name: string;
    branch_id?: number;
    branch?: Branch;
    department_id?: number;
    department?: Department;
    created_at: string;
    [key: string]: any;
}

export interface DesignationFormData {
    designation_name: string;
    branch_id: string;
    department_id: string;
    [key: string]: any;
}

export interface CreateDesignationProps extends CreateProps {
    branches: any[];
    departments: any[];
    [key: string]: any;
}

export interface EditDesignationProps extends EditProps<Designation> {
    branches: any[];
    departments: any[];
    [key: string]: any;
}

export type PaginatedDesignations = PaginatedData<Designation>;
export type DesignationModalState = ModalState<Designation>;

export interface DesignationsIndexProps {
    designations: PaginatedDesignations;
    auth: AuthContext;
    branches: any[];
    departments: any[];
    [key: string]: any;
}
