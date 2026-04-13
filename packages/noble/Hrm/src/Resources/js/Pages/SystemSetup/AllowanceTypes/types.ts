import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface AllowanceType {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    [key: string]: any;
}

export interface AllowanceTypeFormData {
    name: string;
    description: string;
    [key: string]: any;
}

export interface CreateAllowanceTypeProps extends CreateProps {
    [key: string]: any;
}

export interface EditAllowanceTypeProps extends EditProps<AllowanceType> {
    [key: string]: any;
}

export type PaginatedAllowanceTypes = PaginatedData<AllowanceType>;
export type AllowanceTypeModalState = ModalState<AllowanceType>;

export interface AllowanceTypesIndexProps {
    allowancetypes: PaginatedAllowanceTypes;
    auth: AuthContext;
    [key: string]: any;
}
