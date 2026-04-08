export interface Trainer {
    id: number;
    name: string;
    contact: string;
    email: string;
    experience: string;
    branch_id: number;
    department_id: number;
    expertise?: string;
    qualification?: string;
    branch?: Branch;
    department?: Department;
    created_at: string;
    updated_at: string;
    [key: string]: any;
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

export interface TrainersIndexProps {
    trainers: {
        data: Trainer[];
        links: any[];
        meta: any;
    [key: string]: any;
};
    branches: Branch[];
    departments: Department[];
    auth: {
        user: {
            permissions: string[];
        };
    };
}

export interface TrainerFilters {
    name: string;
    branch_id: string;
    department_id: string;
    [key: string]: any;
}

export interface TrainerModalState {
    isOpen: boolean;
    mode: string;
    data: Trainer | null;
    [key: string]: any;
}