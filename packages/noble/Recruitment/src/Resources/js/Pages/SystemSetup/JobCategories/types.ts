import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface JobCategory {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    [key: string]: any;
}

export interface JobCategoryFormData {
    name: string;
    description: string;
    is_active: boolean;
    [key: string]: any;
}

export interface CreateJobCategoryProps extends CreateProps {
    [key: string]: any;
}

export interface EditJobCategoryProps extends EditProps<JobCategory> {
    [key: string]: any;
}

export type PaginatedJobCategories = PaginatedData<JobCategory>;
export type JobCategoryModalState = ModalState<JobCategory>;

export interface JobCategoriesIndexProps {
    jobcategories: PaginatedJobCategories;
    auth: AuthContext;
    [key: string]: any;
}
