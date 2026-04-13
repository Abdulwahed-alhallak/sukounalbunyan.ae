import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface Project {
    id: number;
    name: string;
    description?: string;
    budget?: number;
    start_date?: string;
    end_date?: string;
    status: 'Ongoing' | 'Onhold' | 'Finished';
    team_members?: Array<{
        id: number;
        name: string;
        [key: string]: any;
    }>;
    created_at: string;
}

export interface ProjectFormData {
    name: string;
    description?: string;
    budget?: number;
    start_date?: string;
    end_date?: string;
    status: 'Ongoing' | 'Onhold' | 'Finished';
    user_ids?: number[];
    [key: string]: any;
}

export interface CreateProjectProps extends CreateProps {
    users: Array<{
        id: number;
        name: string;
        [key: string]: any;
    }>;
}

export interface EditProjectProps extends EditProps<Project> {
    users: Array<{
        id: number;
        name: string;
        [key: string]: any;
    }>;
}

export interface ProjectFilters {
    name: string;
    status: string;
    [key: string]: any;
}

export type PaginatedProjects = PaginatedData<Project>;
export type ProjectModalState = ModalState<Project>;

export interface ProjectsIndexProps {
    items: PaginatedProjects;
    users: Array<{
        id: number;
        name: string;
        [key: string]: any;
    }>;
    auth: AuthContext;
    [key: string]: any;
}

export interface ProjectFormErrors {
    name?: string;
    description?: string;
    budget?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
    user_ids?: string;
    [key: string]: any;
}
