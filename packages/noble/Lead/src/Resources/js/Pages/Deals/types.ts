import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface Pipeline {
    id: number;
    name: string;
    [key: string]: any;
}

export interface Stage {
    id: number;
    name: string;
    [key: string]: any;
}

export interface Group {
    id: number;
    name: string;
    [key: string]: any;
}

export interface User {
    id: number;
    name: string;
    [key: string]: any;
}

export interface DealTask {
    id: number;
    deal_id: number;
    name: string;
    date: string;
    time: string;
    priority: string;
    status: string;
    created_by: number;
    creator_id: number;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export interface Deal {
    id: number;
    name: string;
    price: number;
    pipeline_id: number;
    stage_id: number;
    group_id?: number;
    sources?: string[];
    products?: string[];
    notes?: string;
    labels?: any;
    phone?: string;
    permissions?: string[];
    status: string;
    is_active: boolean;
    pipeline?: Pipeline;
    stage?: Stage;
    group?: Group;
    creator_id?: number;
    creator?: User;
    created_at: string;
    tasks?: DealTask[];
    tasks_count?: number;
    complete_tasks_count?: number;
    user_deals?: any[];
    [key: string]: any;
}

export interface CreateDealFormData {
    name: string;
    price: string;
    pipeline_id: string;
    stage_id: string;
    group_id: string;
    sources: string[];
    products: string[];
    notes: string;
    labels: any;
    phone: string;
    permissions: string[];
    status: string;
    is_active: boolean;
    creator_id: string;
    client_id: string[];
    [key: string]: any;
}

export interface EditDealFormData {
    name: string;
    price: string;
    pipeline_id: string;
    stage_id: string;
    group_id: string;
    sources: string[];
    products: string[];
    notes: string;
    labels: any;
    phone: string;
    permissions: string[];
    status: string;
    is_active: boolean;
    creator_id: string;
    [key: string]: any;
}

export interface DealFilters {
    name: string;
    notes: string;
    pipeline_id: string;
    stage_id: string;
    status: string;
    is_active: string;
    user_id: string;
    [key: string]: any;
}

export type PaginatedDeals = PaginatedData<Deal>;
export type DealModalState = ModalState<Deal>;

export interface DealsIndexProps {
    deals: PaginatedDeals;
    auth: AuthContext;
    pipelines: any[];
    stages: any[];
    groups: any[];
    users: any[];
    sources: any[];
    products: any[];
    permissions: any[];
    [key: string]: any;
}

export interface CreateDealProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditDealProps {
    deal: Deal;
    onSuccess: () => void;
    [key: string]: any;
}

export interface DealShowProps {
    deal: Deal;
    [key: string]: any;
}
