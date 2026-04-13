import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface User {
    id: number;
    name: string;
    [key: string]: any;
}

export interface BudgetPeriod {
    id: number;
    period_name: string;
    financial_year: string;
    start_date: string;
    end_date: string;
    status: string;
    approved_by?: {
        name: string;
        [key: string]: any;
    };
    created_at: string;
}

export interface CreateBudgetPeriodFormData {
    period_name: string;
    financial_year: string;
    start_date: string;
    end_date: string;
    [key: string]: any;
}

export interface EditBudgetPeriodFormData {
    period_name: string;
    financial_year: string;
    start_date: string;
    end_date: string;
    status: string;
    [key: string]: any;
}

export interface BudgetPeriodFilters {
    period_name: string;
    financial_year: string;
    status: string;
    date_range: string;
    [key: string]: any;
}

export type PaginatedBudgetPeriods = PaginatedData<BudgetPeriod>;
export type BudgetPeriodModalState = ModalState<BudgetPeriod>;

export interface BudgetPeriodsIndexProps {
    budgetperiods: PaginatedBudgetPeriods;
    auth: AuthContext;
    [key: string]: any;
}

export interface CreateBudgetPeriodProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditBudgetPeriodProps {
    budgetperiod: BudgetPeriod;
    onSuccess: () => void;
    [key: string]: any;
}

export interface BudgetPeriodShowProps {
    budgetperiod: BudgetPeriod;
    [key: string]: any;
}
