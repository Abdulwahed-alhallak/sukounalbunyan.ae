import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface User {
    id: number;
    name: string;
    [key: string]: any;
}

export interface ContractType {
    id: number;
    name: string;
    [key: string]: any;
}

export interface ContractSignature {
    id: number;
    user: User;
    signature_type: string;
    signature_data: string;
    signed_at: string;
    is_finalized: boolean;
    [key: string]: any;
}

export interface Contract {
    id: number;
    subject: string;
    user_id: number;
    value?: number;
    type_id: number;
    start_date: string;
    end_date: string;
    description?: string;
    status: boolean | string;
    user?: User;
    contractType?: ContractType;
    contract_number?: string;
    created_at: string;
    signatures?: ContractSignature[];
    attachments?: any[];
    comments?: any[];
    notes?: any[];
    renewals?: any[];
    [key: string]: any;
}

export interface CreateContractFormData {
    subject: string;
    user_id: string;
    value: string;
    type_id: string;
    start_date: string;
    end_date: string;
    description: string;
    status: boolean;
    sync_to_google_calendar: boolean;
    [key: string]: any;
}

export interface EditContractFormData {
    subject: string;
    user_id: string;
    value: string;
    type_id: string;
    start_date: string;
    end_date: string;
    description: string;
    status: boolean;
    [key: string]: any;
}

export interface ContractFilters {
    subject: string;
    description: string;
    type_id: string;
    status: string;
    user_id: string;
    start_date: string;
    end_date: string;
    [key: string]: any;
}

export type PaginatedContracts = PaginatedData<Contract>;
export type ContractModalState = ModalState<Contract>;

export interface ContractsIndexProps {
    contracts: PaginatedContracts;
    auth: AuthContext;
    users: any[];

    contracttypes: any[];
    [key: string]: any;
}

export interface CreateContractProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditContractProps {
    contract: Contract;
    onSuccess: () => void;
    [key: string]: any;
}

export interface ContractShowProps {
    contract: Contract;
    [key: string]: any;
}