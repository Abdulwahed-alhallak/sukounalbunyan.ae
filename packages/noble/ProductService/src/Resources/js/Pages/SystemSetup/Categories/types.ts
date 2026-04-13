import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface ItemCategory {
    id: number;
    name: string;
    color: string;
    created_at: string;
    [key: string]: any;
}

export interface ItemCategoryFormData {
    name: string;
    color: string;
    [key: string]: any;
}

export interface CreateItemCategoryProps extends CreateProps {
    [key: string]: any;
}

export interface EditItemCategoryProps extends EditProps<ItemCategory> {
    [key: string]: any;
}

export type PaginatedItemCategories = PaginatedData<ItemCategory>;
export type ItemCategoryModalState = ModalState<ItemCategory>;

export interface ItemCategoriesIndexProps {
    categories: PaginatedItemCategories;
    auth: AuthContext;
    [key: string]: any;
}
