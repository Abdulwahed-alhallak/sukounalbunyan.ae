import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface TerminationType {
    id: number;
    termination_type: string;
    created_at: string;
    [key: string]: any;
}

export interface TerminationTypeFormData {
    termination_type: string;
    [key: string]: any;
}

export interface CreateTerminationTypeProps extends CreateProps {
    [key: string]: any;
}

export interface EditTerminationTypeProps extends EditProps<TerminationType> {
    [key: string]: any;
}

export type PaginatedTerminationTypes = PaginatedData<TerminationType>;
export type TerminationTypeModalState = ModalState<TerminationType>;

export interface TerminationTypesIndexProps {
    terminationtypes: PaginatedTerminationTypes;
    auth: AuthContext;
    [key: string]: any;
}
