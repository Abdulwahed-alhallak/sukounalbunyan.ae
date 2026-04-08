import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface WarningType {
    id: number;
    warning_type_name: string;
    created_at: string;
    [key: string]: any;
}

export interface WarningTypeFormData {
    warning_type_name: string;
    [key: string]: any;
}

export interface CreateWarningTypeProps extends CreateProps  {[key: string]: any;
}

export interface EditWarningTypeProps extends EditProps<WarningType>  {[key: string]: any;
}

export type PaginatedWarningTypes = PaginatedData<WarningType>;
export type WarningTypeModalState = ModalState<WarningType>;

export interface WarningTypesIndexProps {
    warningtypes: PaginatedWarningTypes;
    auth: AuthContext;
    [key: string]: any;
}