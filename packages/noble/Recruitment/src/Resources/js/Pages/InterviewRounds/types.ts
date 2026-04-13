import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface JobPosting {
    id: number;
    name: string;
    [key: string]: any;
}

export interface InterviewRound {
    id: number;
    name: string;
    sequence_number: number;
    description?: string;
    status: boolean;
    job_id?: number;
    jobPosting?: JobPosting;
    created_at: string;
    [key: string]: any;
}

export interface CreateInterviewRoundFormData {
    name: string;
    sequence_number: string;
    description: string;
    status: boolean;
    job_id: string;
    [key: string]: any;
}

export interface EditInterviewRoundFormData {
    name: string;
    sequence_number: string;
    description: string;
    status: boolean;
    job_id: string;
    [key: string]: any;
}

export interface InterviewRoundFilters {
    name: string;
    description: string;
    job_id: string;
    status: string;
    [key: string]: any;
}

export type PaginatedInterviewRounds = PaginatedData<InterviewRound>;
export type InterviewRoundModalState = ModalState<InterviewRound>;

export interface InterviewRoundsIndexProps {
    interviewrounds: PaginatedInterviewRounds;
    auth: AuthContext;
    jobpostings: any[];
    [key: string]: any;
}

export interface CreateInterviewRoundProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditInterviewRoundProps {
    interviewround: InterviewRound;
    onSuccess: () => void;
    [key: string]: any;
}

export interface InterviewRoundShowProps {
    interviewround: InterviewRound;
    [key: string]: any;
}