import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface AnnouncementCategory {
    id: number;
    announcement_category: string;
    created_at: string;
    [key: string]: any;
}

export interface AnnouncementCategoryFormData {
    announcement_category: string;
    [key: string]: any;
}

export interface CreateAnnouncementCategoryProps extends CreateProps  {[key: string]: any;
}

export interface EditAnnouncementCategoryProps extends EditProps<AnnouncementCategory>  {[key: string]: any;
}

export type PaginatedAnnouncementCategories = PaginatedData<AnnouncementCategory>;
export type AnnouncementCategoryModalState = ModalState<AnnouncementCategory>;

export interface AnnouncementCategoriesIndexProps {
    announcementcategories: PaginatedAnnouncementCategories;
    auth: AuthContext;
    [key: string]: any;
}