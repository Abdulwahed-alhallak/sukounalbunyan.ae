import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface AwardType {
    id: number;
    name: any;
    description?: any;
    created_at: string;
    [key: string]: any;
}

export interface AwardTypeFormData {
    name: any;
    description: any;
    [key: string]: any;
}

export interface CreateAwardTypeProps extends CreateProps  {[key: string]: any;
}

export interface EditAwardTypeProps extends EditProps<AwardType>  {[key: string]: any;
}

export type PaginatedAwardTypes = PaginatedData<AwardType>;
export type AwardTypeModalState = ModalState<AwardType>;

export interface AwardTypesIndexProps {
    awardtypes: PaginatedAwardTypes;
    auth: AuthContext;
    [key: string]: any;
}