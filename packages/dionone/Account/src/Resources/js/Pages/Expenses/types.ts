export interface Expense {
    id: number;
    expense_date: string;
    category_id: number;
    bank_account_id: number;
    chart_of_account_id: number | null;
    amount: string;
    description: string;
    reference_number: string;
    status: 'draft' | 'approved' | 'posted';
    approved_by: number | null;
    creator_id: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    category?: {
        id: number;
        category_name: string;
    [key: string]: any;
};
    bank_account?: {
        id: number;
        account_name: string;
    };
    chart_of_account?: {
        id: number;
        account_code: string;
        account_name: string;
    };
    approved_by_user?: {
        id: number;
        name: string;
    };
    creator?: {
        id: number;
        name: string;
    };
}

export interface Category {
    id: number;
    category_name: string;
    [key: string]: any;
}

export interface BankAccount {
    id: number;
    account_name: string;
    [key: string]: any;
}

export interface ChartOfAccount {
    id: number;
    account_code: string;
    account_name: string;
    [key: string]: any;
}

export interface ExpenseIndexProps {
    expenses: Expense[];
    auth: any;
    [key: string]: any;
}

export interface CreateExpenseProps {
    categories: Category[];
    bankAccounts: BankAccount[];
    chartOfAccounts: ChartOfAccount[];
    [key: string]: any;
}

export interface EditExpenseProps {
    expense: Expense;
    categories: Category[];
    bankAccounts: BankAccount[];
    chartOfAccounts: ChartOfAccount[];
    [key: string]: any;
}

export interface ShowExpenseProps {
    expense: Expense;
    [key: string]: any;
}

export interface CreateExpenseFormData {
    expense_date: string;
    category_id: string;
    bank_account_id: string;
    chart_of_account_id: string;
    amount: string;
    description: string;
    reference_number: string;
    status: 'draft' | 'approved' | 'posted';
    [key: string]: any;
}

export interface UpdateExpenseFormData extends CreateExpenseFormData  {[key: string]: any;
}