import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface Source {
    id: number;
    name: string;
    created_at: string;
    [key: string]: any;
}

export interface SourceFormData {
    name: string;
    [key: string]: any;
}

export interface CreateSourceProps extends CreateProps  {[key: string]: any;
}

export interface EditSourceProps extends EditProps<Source>  {[key: string]: any;
}

export type PaginatedSources = PaginatedData<Source>;
export type SourceModalState = ModalState<Source>;

export interface SourcesIndexProps {
    sources: PaginatedSources;
    auth: AuthContext;
    [key: string]: any;
}