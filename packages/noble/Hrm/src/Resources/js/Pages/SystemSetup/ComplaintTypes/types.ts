import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface ComplaintType {
    id: number;
    complaint_type: string;
    created_at: string;
    [key: string]: any;
}

export interface ComplaintTypeFormData {
    complaint_type: string;
    [key: string]: any;
}

export interface CreateComplaintTypeProps extends CreateProps {
    [key: string]: any;
}

export interface EditComplaintTypeProps extends EditProps<ComplaintType> {
    [key: string]: any;
}

export type PaginatedComplaintTypes = PaginatedData<ComplaintType>;
export type ComplaintTypeModalState = ModalState<ComplaintType>;

export interface ComplaintTypesIndexProps {
    complainttypes: PaginatedComplaintTypes;
    auth: AuthContext;
    [key: string]: any;
}
