import { PaginatedData, ModalState, AuthContext } from '@/types/common';



export interface Resignation {
    id: number;
    employee_id: number;
    employee?: {
        name: string;
        user_id?: number;
    };
    notice_date?: string;
    resignation_date?: string;
    last_working_date?: string;
    reason?: string;
    description?: string;
    status: string;
    manager_status?: string;
    manager_comment?: string;
    approver_comment?: string;
    document?: string;
    approved_by?: { id: number; name: string; [key: string]: any };
    created_at: string;
}

export interface CreateResignationFormData {
    employee_id: any;
    last_working_date: any;
    reason: any;
    description: any;
    document: any;
    [key: string]: any;
}

export interface EditResignationFormData {
    employee_id: any;
    last_working_date: any;
    reason: any;
    description: any;
    document: any;
    [key: string]: any;
}

export interface ResignationFilters {
    name: string;
    employee_id: string;
    [key: string]: any;
}

export type PaginatedResignations = PaginatedData<Resignation>;
export type ResignationModalState = ModalState<Resignation>;

export interface ResignationsIndexProps {
    resignations: PaginatedResignations;
    auth: AuthContext;
    [key: string]: any;
}

export interface CreateResignationProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditResignationProps {
    resignation: Resignation;
    onSuccess: () => void;
    [key: string]: any;
}

export interface ResignationShowProps {
    resignation: Resignation;
    [key: string]: any;
}