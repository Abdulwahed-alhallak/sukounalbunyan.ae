import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface CandidateSources {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    [key: string]: any;
}

export interface CandidateSourcesFormData {
    name: string;
    description: string;
    is_active: boolean;
    [key: string]: any;
}

export interface CreateCandidateSourcesProps extends CreateProps  {[key: string]: any;
}

export interface EditCandidateSourcesProps extends EditProps<CandidateSources>  {[key: string]: any;
}

export type PaginatedCandidateSources = PaginatedData<CandidateSources>;
export type CandidateSourcesModalState = ModalState<CandidateSources>;

export interface CandidateSourcesIndexProps {
    candidatesources: PaginatedCandidateSources;
    auth: AuthContext;
    [key: string]: any;
}