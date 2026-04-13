import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface Customer {
    id: number;
    name: string;
    email: string;
    [key: string]: any;
}

export interface BankAccount {
    id: number;
    account_name: string;
    account_number: string;
    bank_name: string;
    [key: string]: any;
}

export interface SalesInvoice {
    id: number;
    invoice_number: string;
    invoice_date: string;
    total_amount: number;
    balance_amount: number;
    status: string;
    [key: string]: any;
}

export interface CreditNote {
    id: number;
    credit_note_number: string;
    credit_note_date: string;
    total_amount: number;
    balance_amount: number;
    status: string;
    [key: string]: any;
}

export interface CustomerPaymentAllocation {
    id: number;
    invoice_id: number;
    allocated_amount: number;
    invoice: SalesInvoice;
    [key: string]: any;
}

export interface CustomerPayment {
    id: number;
    payment_number: string;
    payment_date: string;
    customer_id: number;
    bank_account_id: number;
    reference_number?: string;
    payment_amount: number;
    status: 'pending' | 'cleared' | 'cancelled';
    notes?: string;
    customer: Customer;
    bank_account: BankAccount;
    allocations: CustomerPaymentAllocation[];
    created_at: string;
    [key: string]: any;
}

export interface CreateCustomerPaymentFormData {
    payment_date: string;
    customer_id: string;
    bank_account_id: string;
    reference_number: string;
    payment_amount: string;
    notes: string;
    allocations: {
        invoice_id: number;
        amount: number;
        [key: string]: any;
    }[];
    credit_notes: {
        credit_note_id: number;
        amount: number;
    }[];
}

export interface CustomerPaymentFilters {
    customer_id: string;
    status: string;
    search: string;
    [key: string]: any;
}

export type PaginatedCustomerPayments = PaginatedData<CustomerPayment>;
export type CustomerPaymentModalState = ModalState<CustomerPayment>;

export interface CustomerPaymentsIndexProps {
    payments: PaginatedCustomerPayments;
    customers: Customer[];
    bankAccounts: BankAccount[];
    filters: CustomerPaymentFilters;
    auth: AuthContext;
    [key: string]: any;
}

export interface CreateCustomerPaymentProps {
    customers: Customer[];
    bankAccounts: BankAccount[];
    onSuccess: () => void;
    [key: string]: any;
}

export interface CustomerPaymentViewProps {
    payment: CustomerPayment;
    [key: string]: any;
}
