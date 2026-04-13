import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface Category {
    id: number;
    category_name: string;
    category_code: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    [key: string]: any;
}

export interface CreateCategoryFormData {
    category_name: string;
    category_code: string;
    description: string;
    is_active: boolean;
    [key: string]: any;
}

export interface EditCategoryFormData {
    category_name: string;
    category_code: string;
    description: string;
    is_active: boolean;
    [key: string]: any;
}

export interface CategoryFilters {
    category_name: string;
    category_code: string;
    is_active: string;
    [key: string]: any;
}

export type PaginatedCategories = PaginatedData<Category>;
export type CategoryModalState = ModalState<Category>;

export interface CategoriesIndexProps {
    categories: PaginatedCategories;
    auth: AuthContext;
    [key: string]: any;
}

export interface CreateCategoryProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditCategoryProps {
    category: Category;
    onSuccess: () => void;
    [key: string]: any;
}

export interface CategoryShowProps {
    category: Category;
    [key: string]: any;
}
