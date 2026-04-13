export interface Tax {
    id: number;
    tax_name: string;
    rate: number;
    created_at: string;
    [key: string]: any;
}

export interface TaxesIndexProps {
    taxes: Tax[];
    auth: {
        user: {
            permissions: string[];
            [key: string]: any;
        };
    };
}

export interface TaxModalState {
    isOpen: boolean;
    mode: string;
    data: Tax | null;
    [key: string]: any;
}

export interface TaxFormData {
    tax_name: string;
    rate: number;
    [key: string]: any;
}

export interface TaxCreateProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface TaxEditProps {
    tax: Tax;
    onSuccess: () => void;
    [key: string]: any;
}
