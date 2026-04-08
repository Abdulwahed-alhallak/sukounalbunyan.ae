export interface Complaint {
    id: number;
    employee_id?: number;
    against_employee_id?: number;
    complaint_type_id?: number;
    subject: string;
    description: string;
    complaint_date: string;
    status: string;
    manager_status?: string;
    manager_comment?: string;
    document?: string;
    resolved_by?: number;
    resolution_date?: string;
    creator_id: number;
    created_by: number;
    employee?: {
        id: number;
        name: string;
    [key: string]: any;
};
    againstEmployee?: {
        id: number;
        name: string;
    };
    complaintType?: {
        id: number;
        complaint_type: string;
    };
    resolvedBy?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export interface ComplaintsIndexProps {
    complaints: {
        data: Complaint[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: any[];
        meta: any;
    [key: string]: any;
};
    employees: Array<{
        id: number;
        name: string;
    }>;
    complaintTypes: Array<{
        id: number;
        complaint_type: string;
    }>;
    auth: {
        user: {
            permissions: string[];
            company_settings?: any;
            [key: string]: any;
        };
        [key: string]: any;
    };
    [key: string]: any;
}

export interface ComplaintFilters {
    subject: string;
    employee_id: string;
    complaint_type_id: string;
    status: string;
    [key: string]: any;
}

export interface ComplaintModalState {
    isOpen: boolean;
    mode: string;
    data: Complaint | null;
    [key: string]: any;
}

export interface CreateComplaintProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditComplaintProps {
    complaint: Complaint;
    onSuccess: () => void;
    [key: string]: any;
}

export interface CreateComplaintFormData {
    employee_id: string;
    against_employee_id: string;
    complaint_type_id: string;
    subject: string;
    description: string;
    complaint_date: string;
    document: string;
    [key: string]: any;
}

export interface EditComplaintFormData {
    employee_id: string;
    against_employee_id: string;
    complaint_type_id: string;
    subject: string;
    description: string;
    complaint_date: string;
    document: string;
    [key: string]: any;
}

export interface ComplaintStatusProps {
    complaint: Complaint;
    onSuccess: () => void;
    [key: string]: any;
}