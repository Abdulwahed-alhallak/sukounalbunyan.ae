export interface TrainingType {
    id: number;
    name: string;
    description?: string;
    branch_id: number;
    branch?: {
        id: number;
        name: string;
    [key: string]: any;
};
    designations: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Branch {
    id: number;
    branch_name: string;
    [key: string]: any;
}

export interface Department {
    id: number;
    department_name: string;
    branch_id: number;
    [key: string]: any;
}

export interface Designation {
    id: number;
    designation_name: string;
    department_id: number;
    [key: string]: any;
}

export interface TrainingTypesIndexProps {
    trainingTypes: {
        data: TrainingType[];
        links: any[];
        meta: any;
    [key: string]: any;
};
    branches: Branch[];
    departments: Department[];
    designations: Designation[];
    auth: {
        user: {
            permissions: string[];
        };
    };
}

export interface TrainingTypeFilters {
    name: string;
    branch_id: string;
    department_id: string;
    is_active: string;
    [key: string]: any;
}

export interface TrainingTypeModalState {
    isOpen: boolean;
    mode: string;
    data: TrainingType | null;
    [key: string]: any;
}