import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface LoanType {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    [key: string]: any;
}

export interface LoanTypeFormData {
    name: string;
    description: string;
    [key: string]: any;
}

export interface CreateLoanTypeProps extends CreateProps  {[key: string]: any;
}

export interface EditLoanTypeProps extends EditProps<LoanType>  {[key: string]: any;
}

export type PaginatedLoanTypes = PaginatedData<LoanType>;
export type LoanTypeModalState = ModalState<LoanType>;

export interface LoanTypesIndexProps {
    loantypes: PaginatedLoanTypes;
    auth: AuthContext;
    [key: string]: any;
}