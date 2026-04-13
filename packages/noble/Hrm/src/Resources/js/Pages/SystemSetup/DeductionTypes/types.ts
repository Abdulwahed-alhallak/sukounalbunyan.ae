import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface DeductionType {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    [key: string]: any;
}

export interface DeductionTypeFormData {
    name: string;
    description: string;
    [key: string]: any;
}

export interface CreateDeductionTypeProps extends CreateProps {
    [key: string]: any;
}

export interface EditDeductionTypeProps extends EditProps<DeductionType> {
    [key: string]: any;
}

export type PaginatedDeductionTypes = PaginatedData<DeductionType>;
export type DeductionTypeModalState = ModalState<DeductionType>;

export interface DeductionTypesIndexProps {
    deductiontypes: PaginatedDeductionTypes;
    auth: AuthContext;
    [key: string]: any;
}
