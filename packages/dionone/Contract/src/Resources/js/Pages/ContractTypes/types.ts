import { PaginatedData, ModalState, AuthContext } from '@/types/common';



export interface ContractType {
    id: number;
    name: string;
    is_active: boolean;
    contracts_count?: number;
    contracts?: Array<{
        id: number;
        subject: string;
        contract_number?: string;
    [key: string]: any;
}>;
    created_at: string;
}

export interface CreateContractTypeFormData {
    name: string;
    is_active: boolean;
    [key: string]: any;
}

export interface EditContractTypeFormData {
    name: string;
    is_active: boolean;
    [key: string]: any;
}

export interface ContractTypeFilters {
    name: string;
    is_active: string;
    [key: string]: any;
}

export type PaginatedContractTypes = PaginatedData<ContractType>;
export type ContractTypeModalState = ModalState<ContractType>;

export interface ContractTypesIndexProps {
    contracttypes: PaginatedContractTypes;
    auth: AuthContext;
    [key: string]: any;
}

export interface CreateContractTypeProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditContractTypeProps {
    contracttype: ContractType;
    onSuccess: () => void;
    [key: string]: any;
}

export interface ContractTypeShowProps {
    contracttype: ContractType;
    [key: string]: any;
}