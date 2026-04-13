import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface ChartOfAccount {
    id: number;
    name: string;
    [key: string]: any;
}

export interface BankAccount {
    id: number;
    account_number: string;
    account_name: string;
    bank_name: string;
    branch_name?: string;
    account_type: string;
    payment_gateway?: string;
    opening_balance: number;
    current_balance: number;
    iban?: string;
    swift_code?: string;
    routing_number?: string;
    is_active: boolean;
    gl_account_id?: number;
    gl_account?: ChartOfAccount;
    created_at: string;
    [key: string]: any;
}

export interface CreateBankAccountFormData {
    account_number: string;
    account_name: string;
    bank_name: string;
    branch_name: string;
    account_type: string;
    payment_gateway: string;
    opening_balance: string;
    current_balance: string;
    iban: string;
    swift_code: string;
    routing_number: string;
    is_active: boolean;
    gl_account_id: string;
    [key: string]: any;
}

export interface EditBankAccountFormData {
    account_number: string;
    account_name: string;
    bank_name: string;
    branch_name: string;
    account_type: string;
    payment_gateway: string;
    opening_balance: string;
    current_balance: string;
    iban: string;
    swift_code: string;
    routing_number: string;
    is_active: boolean;
    gl_account_id: string;
    [key: string]: any;
}

export interface BankAccountFilters {
    account_number: string;
    account_name: string;
    bank_name: string;
    account_type: string;
    is_active: string;
    [key: string]: any;
}

export type PaginatedBankAccounts = PaginatedData<BankAccount>;
export type BankAccountModalState = ModalState<BankAccount>;

export interface BankAccountsIndexProps {
    bankaccounts: PaginatedBankAccounts;
    auth: AuthContext;
    chartofaccounts: any[];
    [key: string]: any;
}

export interface CreateBankAccountProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditBankAccountProps {
    bankaccount: BankAccount;
    onSuccess: () => void;
    [key: string]: any;
}

export interface BankAccountShowProps {
    bankaccount: BankAccount;
    [key: string]: any;
}