import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface User {
    id: number;
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
}

export interface BudgetPeriod {
    id: number;
    period_name: string;
    financial_year: string;
    start_date: string;
    end_date: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    approved_by?: {
        name: string;
        email?: string;
        id?: number;
    };
    created_at: string;
}

export interface CreateBudgetPeriodFormData {
    period_name: string;
    financial_year: string;
    start_date: string;
    end_date: string;
}

export interface EditBudgetPeriodFormData {
    period_name: string;
    financial_year: string;
    start_date: string;
    end_date: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

export interface BudgetPeriodFilters {
    period_name?: string;
    financial_year?: string;
    status?: 'draft' | 'submitted' | 'approved' | 'rejected';
    date_range?: string;
}

export type PaginatedBudgetPeriods = PaginatedData<BudgetPeriod>;
export type BudgetPeriodModalState = ModalState<BudgetPeriod>;

export interface BudgetPeriodsIndexProps {
    budgetperiods: PaginatedBudgetPeriods;
    auth: AuthContext;
}

export interface CreateBudgetPeriodProps {
    onSuccess: () => void;
}

export interface EditBudgetPeriodProps {
    budgetperiod: BudgetPeriod;
    onSuccess: () => void;
}

export interface BudgetPeriodShowProps {
    budgetperiod: BudgetPeriod;
}
