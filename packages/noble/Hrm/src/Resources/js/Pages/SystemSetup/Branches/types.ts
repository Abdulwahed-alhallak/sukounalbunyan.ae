import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface Branch {
    id: number;
    branch_name: string;
    created_at: string;
    [key: string]: any;
}

export interface BranchFormData {
    branch_name: string;
    [key: string]: any;
}

export interface CreateBranchProps extends CreateProps  {[key: string]: any;
}

export interface EditBranchProps extends EditProps<Branch>  {[key: string]: any;
}

export type PaginatedBranches = PaginatedData<Branch>;
export type BranchModalState = ModalState<Branch>;

export interface BranchesIndexProps {
    branches: PaginatedBranches;
    auth: AuthContext;
    [key: string]: any;
}