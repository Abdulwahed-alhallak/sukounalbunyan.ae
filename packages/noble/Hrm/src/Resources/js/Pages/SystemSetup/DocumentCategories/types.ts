import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface DocumentCategory {
    id: number;
    document_type: string;
    status: boolean;
    created_at: string;
    [key: string]: any;
}

export interface DocumentCategoryFormData {
    document_type: string;
    status: boolean;
    [key: string]: any;
}

export interface CreateDocumentCategoryProps extends CreateProps  {[key: string]: any;
}

export interface EditDocumentCategoryProps extends EditProps<DocumentCategory>  {[key: string]: any;
}

export type PaginatedDocumentCategories = PaginatedData<DocumentCategory>;
export type DocumentCategoryModalState = ModalState<DocumentCategory>;

export interface DocumentCategoriesIndexProps {
    documentcategories: PaginatedDocumentCategories;
    auth: AuthContext;
    [key: string]: any;
}