import { PaginatedData, ModalState, AuthContext, CreateProps } from '@/types/common';

export interface ProjectTask {
    id: number;
    project_id: number;
    milestone_id?: number;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    assigned_to?: string;
    duration?: string;
    description?: string;
    project?: {
        id: number;
        name: string;
        [key: string]: any;
    };
    milestone?: {
        id: number;
        title: string;
    };
    assignedUser?: {
        id: number;
        name: string;
        avatar?: string;
    };
    assignedUsers?: Array<{
        id: number;
        name: string;
        avatar?: string;
    }>;
    start_date?: string;
    end_date?: string;
    stage_id?: number;
    attachments?: Array<{
        id: number;
        file_name: string;
        file_path: string;
        uploader?: {
            id: number;
            name: string;
            avatar?: string;
        };
        created_at: string;
    }>;
    created_at: string;
    [key: string]: any;
}

export interface CreateProjectTaskFormData {
    project_id: number;
    milestone_id?: number;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    assigned_to?: number[];
    duration?: string;
    description?: string;
    stage_id?: number;
    sync_to_google_calendar?: boolean;
    sync_to_outlook_calendar?: boolean;
    media_paths?: string[];
    [key: string]: any;
}

export interface ProjectTaskFilters {
    title: string;
    priority: string;
    date_range?: string;
    user_id?: string;
    project_id?: number;
    per_page?: string | number;
    sort?: string;
    direction?: string;
    view?: string;
    [key: string]: any;
}

export interface Project {
    id: number;
    name: string;
    teamMembers?: Array<{
        id: number;
        name: string;
        [key: string]: any;
    }>;
}

export interface Milestone {
    id: number;
    title: string;
    [key: string]: any;
}

export interface TaskStage {
    id: number;
    name: string;
    color: string;
    order?: number;
    [key: string]: any;
}

export type PaginatedProjectTasks = PaginatedData<ProjectTask>;
export type ProjectTaskModalState = ModalState<ProjectTask> & {
    mode: 'add' | 'edit' | 'view' | '';
};

export interface ProjectTasksIndexProps {
    tasks: PaginatedProjectTasks;
    project?: Project;
    milestones: Milestone[];
    teamMembers: Array<{
        id: number;
        name: string;
        [key: string]: any;
    }>;
    taskStages: TaskStage[];
    auth: AuthContext;
    [key: string]: any;
}
