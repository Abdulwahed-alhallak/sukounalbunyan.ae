import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface CustomQuestion {
    id: number;
    question: string;
    type: boolean;
    options?: string;
    is_required?: boolean;
    is_active?: boolean;
    sort_order?: number;
    created_at: string;
    [key: string]: any;
}

export interface CreateCustomQuestionFormData {
    question: string;
    type: boolean;
    options: string;
    is_required: boolean;
    is_active: boolean;
    sort_order: string;
    [key: string]: any;
}

export interface EditCustomQuestionFormData {
    question: string;
    type: boolean;
    options: string;
    is_required: boolean;
    is_active: boolean;
    sort_order: string;
    [key: string]: any;
}

export interface CustomQuestionFilters {
    question: string;
    type: string;
    is_active: string;
    is_required: string;
    [key: string]: any;
}

export type PaginatedCustomQuestions = PaginatedData<CustomQuestion>;
export type CustomQuestionModalState = ModalState<CustomQuestion>;

export interface CustomQuestionsIndexProps {
    customquestions: PaginatedCustomQuestions;
    auth: AuthContext;
    [key: string]: any;
}

export interface CreateCustomQuestionProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditCustomQuestionProps {
    customquestion: CustomQuestion;
    onSuccess: () => void;
    [key: string]: any;
}

export interface CustomQuestionShowProps {
    customquestion: CustomQuestion;
    [key: string]: any;
}
