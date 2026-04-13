import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface Document {
    id: number;
    title: string;
    description?: string;
    document_category_id?: number;
    document?: string;
    effective_date?: string;
    status: string;
    uploaded_by?: number;
    approved_by?: number;
    created_at: string;
    [key: string]: any;
}

export interface CreateDocumentFormData {
    title: string;
    description: string;
    document_category_id: string;
    document: string;
    effective_date: string;
    status: string;
    uploaded_by: string;
    approved_by: string;
    [key: string]: any;
}

export interface EditDocumentFormData {
    title: string;
    description: string;
    document_category_id: string;
    document: string;
    effective_date: string;
    status: string;
    uploaded_by: string;
    approved_by: string;
    [key: string]: any;
}

export interface DocumentFilters {
    title: string;
    document_category_id: string;
    [key: string]: any;
}

export type PaginatedDocuments = PaginatedData<Document>;
export type DocumentModalState = ModalState<Document>;

export interface DocumentsIndexProps {
    documents: PaginatedDocuments;
    auth: AuthContext;
    documentcategories: any[];
    users: any[];
    [key: string]: any;
}

export interface CreateDocumentProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditDocumentProps {
    document: Document;
    onSuccess: () => void;
    [key: string]: any;
}

export interface DocumentShowProps {
    document: Document;
    [key: string]: any;
}
