import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface InterviewType {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    [key: string]: any;
}

export interface InterviewTypeFormData {
    name: string;
    description: string;
    is_active: boolean;
    [key: string]: any;
}

export interface CreateInterviewTypeProps extends CreateProps  {[key: string]: any;
}

export interface EditInterviewTypeProps extends EditProps<InterviewType>  {[key: string]: any;
}

export type PaginatedInterviewTypes = PaginatedData<InterviewType>;
export type InterviewTypeModalState = ModalState<InterviewType>;

export interface InterviewTypesIndexProps {
    interviewtypes: PaginatedInterviewTypes;
    auth: AuthContext;
    [key: string]: any;
}