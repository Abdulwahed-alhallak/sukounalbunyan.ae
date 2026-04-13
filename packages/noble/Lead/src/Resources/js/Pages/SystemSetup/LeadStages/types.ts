import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface LeadStage {
    id: number;
    name: string;
    order: number;
    pipeline_id?: number;
    pipeline?: Pipeline;
    created_at: string;
    [key: string]: any;
}

export interface LeadStageFormData {
    name: string;
    order: string;
    pipeline_id: string;
    [key: string]: any;
}

export interface CreateLeadStageProps extends CreateProps {
    pipelines: any[];
    defaultPipelineId?: number;
    [key: string]: any;
}

export interface EditLeadStageProps extends EditProps<LeadStage> {
    pipelines: any[];
    [key: string]: any;
}

export type PaginatedLeadStages = PaginatedData<LeadStage>;
export type LeadStageModalState = ModalState<LeadStage>;

export interface LeadStagesIndexProps {
    leadstages: PaginatedLeadStages;
    auth: AuthContext;
    pipelines: any[];
    [key: string]: any;
}
