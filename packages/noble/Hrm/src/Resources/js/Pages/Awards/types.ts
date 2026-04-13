import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface Award {
    id: number;
    employee_id: number;
    award_type_id: number;
    award_date?: string;
    description?: string;
    certificate?: string;
    status: string;
    manager_status: string;
    manager_comment?: string;
    approver_comment?: string;
    employee?: {
        name: string;
        user_id?: number;
    };
    awardType?: {
        name: string;
    };
    created_at: string;
    [key: string]: any;
}

export interface CreateAwardFormData {
    employee_id: any;
    award_type_id: any;
    award_date: any;
    description: any;
    certificate: any;
    [key: string]: any;
}

export interface EditAwardFormData {
    employee_id: any;
    award_type_id: any;
    award_date: any;
    description: any;
    certificate: any;
    [key: string]: any;
}

export interface AwardFilters {
    name: string;
    employee_id?: string;
    award_type_id?: string;
    [key: string]: any;
}

export type PaginatedAwards = PaginatedData<Award>;
export type AwardModalState = ModalState<Award>;

export interface AwardsIndexProps {
    awards?: PaginatedAwards;
    auth: any;
    employees?: any[];
    awardTypes?: any[];
    [key: string]: any;
}

export interface CreateAwardProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditAwardProps {
    award: Award;
    onSuccess: () => void;
    [key: string]: any;
}

export interface AwardShowProps {
    award: Award;
    [key: string]: any;
}