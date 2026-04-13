import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface User {
    id: number;
    name: string;
    [key: string]: any;
}

export interface TerminationType {
    id: number;
    name: string;
    [key: string]: any;
}

export interface Termination {
    id: number;
    notice_date?: string;
    termination_date: string;
    reason: string;
    description?: string;
    document?: string;
    employee_id?: number;
    employee?: User;
    termination_type_id?: number;
    terminationType?: TerminationType;
    created_at: string;
    [key: string]: any;
}

export interface CreateTerminationFormData {
    notice_date: string;
    termination_date: string;
    reason: string;
    description: string;
    document: string;
    employee_id: string;
    termination_type_id: string;
    [key: string]: any;
}

export interface EditTerminationFormData {
    notice_date: string;
    termination_date: string;
    reason: string;
    description: string;
    document: string;
    employee_id: string;
    termination_type_id: string;
    [key: string]: any;
}

export interface TerminationFilters {
    name: string;
    employee_id: string;
    [key: string]: any;
}

export type PaginatedTerminations = PaginatedData<Termination>;
export type TerminationModalState = { isOpen: boolean; mode: string; data: Termination | null; };

export interface TerminationsIndexProps {
    terminations: PaginatedTerminations;
    auth: AuthContext;
    users: any[];
    terminationtypes: any[];
    [key: string]: any;
}

export interface CreateTerminationProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditTerminationProps {
    termination: Termination;
    onSuccess: () => void;
    [key: string]: any;
}

export interface TerminationShowProps {
    termination: Termination;
    [key: string]: any;
}