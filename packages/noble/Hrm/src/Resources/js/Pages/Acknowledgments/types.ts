import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface User {
    id: number;
    name: string;
    [key: string]: any;
}

export interface HrmDocument {
    id: number;
    title?: string;
    name?: string;
    document?: string;
    [key: string]: any;
}

export interface Acknowledgment {
    id: number;
    employee_id: number;
    document_id?: number;
    status: string;
    acknowledgment_note?: string;
    acknowledged_at?: any;
    assigned_by?: User;
    employee?: User;
    document?: HrmDocument;
    created_at: string;
    [key: string]: any;
}

export interface CreateAcknowledgmentFormData {
    employee_id: string;
    document_id: string;
    status: string;
    acknowledgment_note: string;
    acknowledged_at: any;
    assigned_by: string;
    [key: string]: any;
}

export interface EditAcknowledgmentFormData {
    employee_id: string;
    document_id: string;
    status: string;
    acknowledgment_note: string;
    acknowledged_at: any;
    assigned_by: string;
    [key: string]: any;
}

export interface AcknowledgmentFilters {
    acknowledgment_note: string;
    employee_id: string;
    document_id: string;
    status: string;
    [key: string]: any;
}

export type PaginatedAcknowledgments = PaginatedData<Acknowledgment>;

export interface AcknowledgmentsIndexProps {
    acknowledgments: PaginatedAcknowledgments;
    auth: AuthContext;
    users: any[];
    hrmdocuments: any[];
    [key: string]: any;
}

export interface CreateAcknowledgmentProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditAcknowledgmentProps {
    acknowledgment: Acknowledgment;
    onSuccess: () => void;
    [key: string]: any;
}

export interface AcknowledgmentShowProps {
    acknowledgment: Acknowledgment;
    [key: string]: any;
}

export interface AcknowledgmentModalState {
    isOpen: boolean;
    mode: string;
    data: Acknowledgment | null;
    [key: string]: any;
}
