import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface OnboardingChecklist {
    id: number;
    name: string;
    [key: string]: any;
}

export interface ChecklistItem {
    id: number;
    checklist_id: number;
    task_name: string;
    description?: string;
    category?: string;
    assigned_to_role?: string;
    due_day?: number;
    is_required: boolean;
    status: boolean;
    checklist?: OnboardingChecklist;
    created_at: string;
    [key: string]: any;
}

export interface CreateChecklistItemFormData {
    checklist_id: string;
    task_name: string;
    description: string;
    category: string;
    assigned_to_role: string;
    due_day: string;
    is_required: boolean;
    status: boolean;
    [key: string]: any;
}

export interface EditChecklistItemFormData {
    checklist_id: string;
    task_name: string;
    description: string;
    category: string;
    assigned_to_role: string;
    due_day: string;
    is_required: boolean;
    status: boolean;
    [key: string]: any;
}

export interface ChecklistItemFilters {
    task_name: string;
    description: string;
    assigned_to_role: string;
    checklist_id: string;
    category: string;
    is_required: string;
    status: string;
    [key: string]: any;
}

export type PaginatedChecklistItems = PaginatedData<ChecklistItem>;
export type ChecklistItemModalState = ModalState<ChecklistItem>;

export interface ChecklistItemsIndexProps {
    checklistitems: PaginatedChecklistItems;
    auth: AuthContext;
    onboardingchecklists: any[];
    [key: string]: any;
}

export interface CreateChecklistItemProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditChecklistItemProps {
    checklistitem: ChecklistItem;
    onSuccess: () => void;
    [key: string]: any;
}

export interface ChecklistItemShowProps {
    checklistitem: ChecklistItem;
    [key: string]: any;
}