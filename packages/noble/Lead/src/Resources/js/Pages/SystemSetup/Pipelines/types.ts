import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface Pipeline {
    id: number;
    name: string;
    created_at: string;
    [key: string]: any;
}

export interface PipelineFormData {
    name: string;
    [key: string]: any;
}

export interface CreatePipelineProps extends CreateProps {
    [key: string]: any;
}

export interface EditPipelineProps extends EditProps<Pipeline> {
    [key: string]: any;
}

export type PaginatedPipelines = PaginatedData<Pipeline>;
export type PipelineModalState = ModalState<Pipeline>;

export interface PipelinesIndexProps {
    pipelines: PaginatedPipelines;
    auth: AuthContext;
    [key: string]: any;
}
