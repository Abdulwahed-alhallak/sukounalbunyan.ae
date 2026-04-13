import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface Lead {
    id: number;
    name: string;
    email: any;
    subject: string;
    user_id?: number;
    pipeline_id?: number;
    stage_id?: number;
    sources?: string[] | string;
    products?: string[] | string;
    notes?: string;
    labels?: string;
    order?: number;
    phone?: string;
    is_active: boolean;
    date?: string;
    creator_id?: number;
    created_at: string;
    additional_images?: string[] | string;
    stage?: any;
    user?: any;
    user_leads?: any[];
    tasks?: any[];
    emails?: any[];
    discussions?: any[];
    calls?: any[];
    activities?: any[];
    tasks_count?: number;
    complete_tasks_count?: number;
    attachments?: any[];
    [key: string]: any;
}

export interface CreateLeadFormData {
    subject: string;
    user_id: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    media_paths?: string[];
    [key: string]: any;
}

export interface EditLeadFormData {
    subject: string;
    user_id: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    pipeline_id: string;
    stage_id: string;
    sources: string[];
    products: string[];
    notes: string;
    media_paths?: string[];
    [key: string]: any;
}

export interface LeadFilters {
    name: string;
    email: string;
    subject: string;
    is_active: string;
    user_id: string;
    pipeline_id: string;
    stage_id: string;
    [key: string]: any;
}

export type PaginatedLeads = PaginatedData<Lead>;
export type LeadModalState = ModalState<Lead>;

export interface LeadsIndexProps {
    leads: PaginatedLeads;
    auth: AuthContext;
    users: any[];
    pipelines: any[];
    stages: any[];
    labels: any[];
    sources: any[];
    products: any[];
    [key: string]: any;
}

export interface CreateLeadProps {
    pipelines: any[];
    stages: any[];
    sources: any[];
    products: any[];
    users: any[];
    onClose: () => void;
    [key: string]: any;
}

export interface EditLeadProps {
    lead: Lead;
    pipelines: any[];
    stages: any[];
    sources: any[];
    products: any[];
    users: any[];
    onClose: () => void;
    [key: string]: any;
}

export interface LeadShowProps {
    lead: Lead;
    [key: string]: any;
}
