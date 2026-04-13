import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface OnboardingChecklist {
    id: number;
    name: string;
    description?: string;
    is_default: boolean;
    status: boolean;
    created_at: string;
    checklist_items_count?: number;
    [key: string]: any;
}

export interface OnboardingChecklistFormData {
    name: string;
    description: string;
    is_default: boolean;
    status: boolean;
    [key: string]: any;
}

export interface CreateOnboardingChecklistProps extends CreateProps {
    [key: string]: any;
}

export interface EditOnboardingChecklistProps extends EditProps<OnboardingChecklist> {
    [key: string]: any;
}

export type PaginatedOnboardingChecklists = PaginatedData<OnboardingChecklist>;
export type OnboardingChecklistModalState = ModalState<OnboardingChecklist>;

export interface OnboardingChecklistsIndexProps {
    onboardingchecklists: PaginatedOnboardingChecklists;
    auth: AuthContext;
    [key: string]: any;
}
