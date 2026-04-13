import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface BugStage {
    id: number;
    name: string;
    color: string;
    created_at: string;
    [key: string]: any;
}

export interface BugStageFormData {
    name: string;
    color: string;
    [key: string]: any;
}

export interface CreateBugStageProps extends CreateProps {
    [key: string]: any;
}

export interface EditBugStageProps extends EditProps<BugStage> {
    [key: string]: any;
}

export type PaginatedBugStages = PaginatedData<BugStage>;
export type BugStageModalState = ModalState<BugStage>;

export interface BugStagesIndexProps {
    bugStages: PaginatedBugStages;
    auth: AuthContext;
    [key: string]: any;
}
