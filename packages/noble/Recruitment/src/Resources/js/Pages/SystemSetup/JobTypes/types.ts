import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface JobType {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    [key: string]: any;
}

export interface JobTypeFormData {
    name: string;
    description: string;
    is_active: boolean;
    [key: string]: any;
}

export interface CreateJobTypeProps extends CreateProps {
    [key: string]: any;
}

export interface EditJobTypeProps extends EditProps<JobType> {
    [key: string]: any;
}

export type PaginatedJobTypes = PaginatedData<JobType>;
export type JobTypeModalState = ModalState<JobType>;

export interface JobTypesIndexProps {
    jobtypes: PaginatedJobTypes;
    auth: AuthContext;
    [key: string]: any;
}
