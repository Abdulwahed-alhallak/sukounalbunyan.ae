import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface ExpenseCategories {
    id: number;
    category_name: any;
    category_code: any;
    gl_account_id: any;
    description?: any;
    is_active: boolean;
    gl_account?: ChartOfAccount;
    created_at: string;
    [key: string]: any;
}

export interface ExpenseCategoriesFormData {
    category_name: any;
    category_code: any;
    gl_account_id: any;
    description: any;
    is_active: boolean;
    [key: string]: any;
}

export interface CreateExpenseCategoriesProps extends CreateProps  {
    chartofaccounts: any[];
    [key: string]: any;
}

export interface EditExpenseCategoriesProps extends EditProps<ExpenseCategories>  {
    chartofaccounts: any[];
    [key: string]: any;
}

export type PaginatedExpenseCategories = PaginatedData<ExpenseCategories>;
export type ExpenseCategoriesModalState = ModalState<ExpenseCategories>;

export interface ExpenseCategoriesIndexProps {
    expensecategories: PaginatedExpenseCategories;
    auth: AuthContext;
    chartofaccounts: any[];
    [key: string]: any;
}