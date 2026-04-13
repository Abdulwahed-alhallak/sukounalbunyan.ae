import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface Label {
    id: number;
    name: string;
    color: any;
    pipeline_id?: number;
    pipeline?: Pipeline;
    created_at: string;
    [key: string]: any;
}

export interface LabelFormData {
    name: string;
    color: any;
    pipeline_id: string;
    [key: string]: any;
}

export interface CreateLabelProps extends CreateProps  {
    pipelines: any[];
    defaultPipelineId?: number;
    [key: string]: any;
}

export interface EditLabelProps extends EditProps<Label>  {
    pipelines: any[];
    [key: string]: any;
}

export type PaginatedLabels = PaginatedData<Label>;
export type LabelModalState = ModalState<Label>;

export interface LabelsIndexProps {
    labels: PaginatedLabels;
    auth: AuthContext;
    pipelines: any[];
    [key: string]: any;
}