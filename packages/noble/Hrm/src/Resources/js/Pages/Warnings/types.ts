import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface User {
    id: number;
    name: string;
    [key: string]: any;
}

export interface WarningType {
    id: number;
    name: string;
    [key: string]: any;
}

export interface Warning {
    id: number;
    subject: string;
    severity: any;
    warning_date: string;
    description?: string;
    document?: string;
    employee_id?: any;
    employee?: User;
    warning_by?: any;
    warningBy?: User;
    warning_type_id?: number;
    warningType?: WarningType;
    created_at: string;
    [key: string]: any;
}

export interface CreateWarningFormData {
    subject: string;
    severity: any;
    warning_date: string;
    description: string;
    document: string;
    employee_id: string;
    warning_by: string;
    warning_type_id: string;
    [key: string]: any;
}

export interface EditWarningFormData {
    subject: string;
    severity: any;
    warning_date: string;
    description: string;
    document: string;
    employee_id: string;
    warning_by: string;
    warning_type_id: string;
    [key: string]: any;
}

export interface WarningFilters {
    subject: string;
    employee_id: string;
    [key: string]: any;
}

export type PaginatedWarnings = PaginatedData<Warning>;
export type WarningModalState = { isOpen: boolean; mode: string; data: Warning | null; };

export interface WarningsIndexProps {
    warnings: PaginatedWarnings;
    auth: AuthContext;
    users: any[];
    warningtypes: any[];
    [key: string]: any;
}

export interface CreateWarningProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditWarningProps {
    warning: Warning;
    onSuccess: () => void;
    [key: string]: any;
}

export interface WarningShowProps {
    warning: Warning;
    [key: string]: any;
}