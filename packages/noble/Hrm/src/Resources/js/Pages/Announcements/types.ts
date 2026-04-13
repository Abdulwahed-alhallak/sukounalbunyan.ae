import { PaginatedData, ModalState, AuthContext } from '@/types/common';
import { PageProps } from '@/types';

export interface AnnouncementCategory {
    id: number;
    name: string;
    announcement_category?: string;
    [key: string]: any;
}

export interface Department {
    id: number;
    name: string;
    department_name?: string;
    [key: string]: any;
}

export interface Announcement {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    announcement_category_id: number;
    announcement_category?: AnnouncementCategory;
    priority: string;
    status: string;
    departments?: Department[];
    approved_by?: {
        id: number;
        name: string;
        [key: string]: any;
    };
    created_at: string;
    [key: string]: any;
}

export interface CreateAnnouncementFormData {
    title: string;
    announcement_category_id: string;
    departments: string[];
    priority: string;
    status: string;
    start_date: string;
    end_date: string;
    description: string;
    [key: string]: any;
}

export interface EditAnnouncementFormData extends CreateAnnouncementFormData {
    id: number;
    [key: string]: any;
}

export interface AnnouncementFilters {
    title: string;
    description: string;
    priority: string;
    status: string;
    [key: string]: any;
}

export type PaginatedAnnouncements = PaginatedData<Announcement>;

export interface AnnouncementModalState {
    isOpen: boolean;
    mode: string;
    data: Announcement | null;
    [key: string]: any;
}

export interface AnnouncementsIndexProps extends PageProps<any> {
    announcements: PaginatedAnnouncements;
    announcementcategories: AnnouncementCategory[];
    departments: Department[];
    [key: string]: any;
}

export interface CreateAnnouncementProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditAnnouncementProps {
    announcement: Announcement;
    onSuccess: () => void;
    [key: string]: any;
}