import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface JobLocation {
    id: number;
    name: string;
    remote_work: boolean;
    address: string;
    city: any;
    state: any;
    country: any;
    postal_code: any;
    status: boolean;
    created_at: string;
    [key: string]: any;
}

export interface CreateJobLocationFormData {
    name: string;
    remote_work: boolean;
    address: string;
    city: any;
    state: any;
    country: any;
    postal_code: any;
    status: boolean;
    [key: string]: any;
}

export interface EditJobLocationFormData {
    name: string;
    remote_work: boolean;
    address: string;
    city: any;
    state: any;
    country: any;
    postal_code: any;
    status: boolean;
    [key: string]: any;
}

export interface JobLocationFilters {
    name: string;
    city: string;
    state: string;
    country: string;
    status: string;
    remote_work: string;
    [key: string]: any;
}

export type PaginatedJobLocations = PaginatedData<JobLocation>;
export type JobLocationModalState = ModalState<JobLocation>;

export interface JobLocationsIndexProps {
    joblocations: PaginatedJobLocations;
    auth: AuthContext;
    [key: string]: any;
}

export interface CreateJobLocationProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditJobLocationProps {
    joblocation: JobLocation;
    onSuccess: () => void;
    [key: string]: any;
}

export interface JobLocationShowProps {
    joblocation: JobLocation;
    [key: string]: any;
}
