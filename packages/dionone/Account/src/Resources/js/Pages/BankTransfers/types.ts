export interface BankAccount {
    id: number;
    account_name: string;
    account_number: string;
    current_balance: number;
    [key: string]: any;
}

export interface BankTransfer {
    id: number;
    transfer_number: string;
    transfer_date: string;
    transfer_amount: number;
    transfer_charges: number;
    reference_number: string;
    description: string;
    status: 'pending' | 'completed' | 'failed';
    from_account: BankAccount;
    to_account: BankAccount;
    created_at: string;
    [key: string]: any;
}

export interface BankTransferFilters {
    transfer_number: string;
    status: string;
    from_account_id: string;
    to_account_id: string;
    [key: string]: any;
}

export interface BankTransferModalState {
    isOpen: boolean;
    mode: string;
    data: BankTransfer | null;
    [key: string]: any;
}

export interface BankTransfersIndexProps {
    banktransfers: {
        data: BankTransfer[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any;
        meta: any;
    [key: string]: any;
};
    bankaccounts: BankAccount[];
    auth: {
        user: {
            permissions: string[];
        };
    };
}