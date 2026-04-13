import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface EmployeeDocumentType {
    id: number;
    document_name: string;
    description?: string;
    is_required: boolean;
    created_at: string;
    [key: string]: any;
}

export interface EmployeeDocumentTypeFormData {
    document_name: string;
    description: string;
    is_required: boolean;
    [key: string]: any;
}

export interface CreateEmployeeDocumentTypeProps extends CreateProps  {[key: string]: any;
}

export interface EditEmployeeDocumentTypeProps extends EditProps<EmployeeDocumentType>  {[key: string]: any;
}

export type PaginatedEmployeeDocumentTypes = PaginatedData<EmployeeDocumentType>;
export type EmployeeDocumentTypeModalState = ModalState<EmployeeDocumentType>;

export interface EmployeeDocumentTypesIndexProps {
    employeedocumenttypes: PaginatedEmployeeDocumentTypes;
    auth: AuthContext;
    [key: string]: any;
}