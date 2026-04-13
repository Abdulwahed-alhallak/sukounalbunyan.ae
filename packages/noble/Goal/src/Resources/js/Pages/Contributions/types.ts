import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface GoalContribution {
    id: number;
    goal_id: number;
    contribution_date: string;
    contribution_amount: number;
    contribution_type: 'manual' | 'automatic' | 'journal_entry';
    reference_type?: 'journal_entry' | 'bank_transaction' | 'manual';
    reference_id?: number;
    notes?: string;
    goal?: {
        id: number;
        goal_name: string;
        [key: string]: any;
    };
    created_at: string;
}

export interface CreateContributionFormData {
    goal_id: number;
    contribution_date: string;
    contribution_amount: number;
    contribution_type: 'manual' | 'automatic' | 'journal_entry';
    reference_type?: 'journal_entry' | 'bank_transaction' | 'manual';
    reference_id?: number;
    notes?: string;
    [key: string]: any;
}

export interface EditContributionFormData {
    goal_id: number;
    contribution_date: string;
    contribution_amount: number;
    contribution_type: 'manual' | 'automatic' | 'journal_entry';
    reference_type?: 'journal_entry' | 'bank_transaction' | 'manual';
    reference_id?: number;
    notes?: string;
    [key: string]: any;
}

export interface ContributionFilters {
    goal_name: string;
    goal_id: string;
    contribution_type: string;
    date_range: string;
    [key: string]: any;
}

export type PaginatedContributions = PaginatedData<GoalContribution>;

export interface ContributionModalState {
    isOpen: boolean;
    mode: string;
    data: GoalContribution | null;
    [key: string]: any;
}

export interface ContributionsIndexProps {
    contributions: PaginatedContributions;
    goals: Array<{
        id: number;
        goal_name: string;
        [key: string]: any;
    }>;
    auth: AuthContext;
    [key: string]: any;
}

export interface CreateContributionProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditContributionProps {
    contribution: GoalContribution;
    onSuccess: () => void;
    [key: string]: any;
}
