import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface TaskStage {
    id: number;
    name: string;
    color: string;
    created_at: string;
    [key: string]: any;
}

export interface TaskStageFormData {
    name: string;
    color: string;
    [key: string]: any;
}

export interface CreateTaskStageProps extends CreateProps {
    [key: string]: any;
}

export interface EditTaskStageProps extends EditProps<TaskStage> {
    [key: string]: any;
}

export type PaginatedTaskStages = PaginatedData<TaskStage>;
export type TaskStageModalState = ModalState<TaskStage>;

export interface TaskStagesIndexProps {
    taskStages: PaginatedTaskStages;
    auth: AuthContext;
    [key: string]: any;
}
