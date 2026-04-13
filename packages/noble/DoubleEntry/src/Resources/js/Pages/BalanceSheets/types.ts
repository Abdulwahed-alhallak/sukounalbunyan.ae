export interface BalanceSheet {
    id: number;
    balance_sheet_date: string;
    financial_year: string;
    total_assets: number;
    total_liabilities: number;
    total_equity: number;
    is_balanced: boolean;
    status: 'draft' | 'finalized';
    creator_id: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    items?: BalanceSheetItem[];
    [key: string]: any;
}

export interface BalanceSheetItem {
    id: number;
    balance_sheet_id: number;
    account_id: number;
    section_type: 'assets' | 'liabilities' | 'equity';
    sub_section:
        | 'current_assets'
        | 'fixed_assets'
        | 'other_assets'
        | 'current_liabilities'
        | 'long_term_liabilities'
        | 'equity';
    amount: number;
    creator_id: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    account?: {
        id: number;
        account_code: string;
        account_name: string;
        normal_balance: string;
        [key: string]: any;
    };
}

export interface BalanceSheetsIndexProps {
    balanceSheets: {
        data: BalanceSheet[];
        links: any[];
        meta: any;
        [key: string]: any;
    };
    filters: BalanceSheetFilters;
    auth: {
        user: {
            permissions: string[];
        };
    };
}

export interface BalanceSheetFilters {
    financial_year?: string;
    status?: string;
    [key: string]: any;
}

export interface ComparativeBalanceSheet {
    id: number;
    current_period_id: number;
    previous_period_id: number;
    comparison_date: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export interface BalanceSheetModalState {
    isOpen: boolean;
    mode: string;
    data: BalanceSheet | null;
    [key: string]: any;
}

export interface BalanceSheetNote {
    id: number;
    balance_sheet_id: number;
    note_number: number;
    note_title: string;
    note_content: string;
    created_at: string;
    [key: string]: any;
}

export interface BalanceSheetViewProps {
    balanceSheet: BalanceSheet & {
        notes?: BalanceSheetNote[];
        [key: string]: any;
    };
    groupedItems: {
        [sectionType: string]: {
            [subSection: string]: BalanceSheetItem[];
        };
    };
    allBalanceSheets?: {
        id: number;
        balance_sheet_date: string;
        financial_year: string;
    }[];
    otherBalanceSheets?: {
        id: number;
        balance_sheet_date: string;
        financial_year: string;
    }[];
    auth: {
        user: {
            permissions: string[];
        };
    };
}
