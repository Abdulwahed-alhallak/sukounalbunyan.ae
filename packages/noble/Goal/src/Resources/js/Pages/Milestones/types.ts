export interface Goal {
    id: number;
    goal_name: string;
    [key: string]: any;
}

export interface Milestone {
    id: number;
    goal_id: number;
    milestone_name: string;
    milestone_description: string;
    target_amount: number;
    current_amount: number;
    target_date: string;
    status: string;
    goal?: Goal;
    [key: string]: any;
}

export interface CreateMilestoneFormData {
    goal_id: string;
    milestone_name: string;
    milestone_description: string;
    target_amount: number;
    current_amount: number;
    target_date: string;
    status: string;
    [key: string]: any;
}

export interface EditMilestoneFormData {
    goal_id: string;
    milestone_name: string;
    milestone_description: string;
    target_amount: number;
    current_amount: number;
    target_date: string;
    status: string;
    [key: string]: any;
}

export interface CreateMilestoneProps {
    goals: Goal[];
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditMilestoneProps {
    milestone: Milestone;
    goals: Goal[];
    onSuccess: () => void;
    [key: string]: any;
}

export interface MilestonesIndexProps {
    milestones: any;
    goals: Goal[];
    auth: any;
    [key: string]: any;
}

export interface MilestoneFilters {
    milestone_name: string;
    status: string;
    goal_id: string;
    date_range: string;
    [key: string]: any;
}

export interface MilestoneModalState {
    isOpen: boolean;
    mode: string;
    data: Milestone | null;
    [key: string]: any;
}