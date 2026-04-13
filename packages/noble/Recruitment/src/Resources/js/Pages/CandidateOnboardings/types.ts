import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface Candidate {
    id: number;
    name: string;
    [key: string]: any;
}

export interface OnboardingChecklist {
    id: number;
    name: string;
    [key: string]: any;
}

export interface User {
    id: number;
    name: string;
    [key: string]: any;
}

export interface CandidateOnboarding {
    id: number;
    candidate_id: any;
    checklist_id: any;
    start_date: any;
    buddy_employee_id: any;
    status: boolean;
    candidate?: Candidate;
    checklist?: OnboardingChecklist;
    buddy?: User;
    created_at: string;
    [key: string]: any;
}

export interface CreateCandidateOnboardingFormData {
    candidate_id: any;
    checklist_id: any;
    start_date: any;
    buddy_employee_id: any;
    [key: string]: any;
}

export interface EditCandidateOnboardingFormData {
    candidate_id: any;
    checklist_id: any;
    start_date: any;
    buddy_employee_id: any;
    status: string;
    [key: string]: any;
}

export interface CandidateOnboardingFilters {
    search: string;
    candidate_id: string;
    checklist_id: string;
    buddy_employee_id: string;
    status: string;
    start_date_from: string;
    start_date_to: string;
    [key: string]: any;
}

export type PaginatedCandidateOnboardings = PaginatedData<CandidateOnboarding>;
export type CandidateOnboardingModalState = ModalState<CandidateOnboarding>;

export interface CandidateOnboardingsIndexProps {
    candidateonboardings: PaginatedCandidateOnboardings;
    auth: AuthContext;
    candidates: any[];
    onboardingchecklists: any[];
    users: any[];
    [key: string]: any;
}

export interface CreateCandidateOnboardingProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditCandidateOnboardingProps {
    candidateonboarding: CandidateOnboarding;
    onSuccess: () => void;
    [key: string]: any;
}

export interface CandidateOnboardingShowProps {
    candidateonboarding: CandidateOnboarding;
    [key: string]: any;
}
