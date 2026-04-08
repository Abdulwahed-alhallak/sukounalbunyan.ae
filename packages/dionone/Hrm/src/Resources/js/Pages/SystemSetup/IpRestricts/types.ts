import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface IpRestrict {
    id: number;
    ip: string;
    created_at: string;
    [key: string]: any;
}

export interface IpRestrictFormData {
    ip: string;
    [key: string]: any;
}

export interface CreateIpRestrictProps extends CreateProps  {[key: string]: any;
}

export interface EditIpRestrictProps extends EditProps<IpRestrict>  {[key: string]: any;
}

export type PaginatedIpRestricts = PaginatedData<IpRestrict>;
export type IpRestrictModalState = ModalState<IpRestrict>;

export interface IpRestrictsIndexProps {
    iprestricts: PaginatedIpRestricts;
    auth: AuthContext;
    ipRestrictEnabled: boolean;
    [key: string]: any;
}