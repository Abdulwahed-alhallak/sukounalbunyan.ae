// Generic pagination interface
export interface PaginatedData<T> {
    data: T[];
    links: any[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    [key: string]: any;
}

// Generic modal state interface
export interface ModalState<T = any> {
    isOpen: boolean;
    mode: 'add' | 'edit' | 'view' | '';
    data: T | null;
}

// Auth user interface
export interface AuthUser {
    id: number;
    type?: string;
    permissions: string[];
    [key: string]: any;
}

// Generic auth context
export interface AuthContext {
    user: AuthUser;
    [key: string]: any;
}

// Generic component props
export interface CreateProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditProps<T> {
    data: T;
    onSuccess: () => void;
    [key: string]: any;
}