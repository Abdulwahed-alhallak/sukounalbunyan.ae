import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface EventType {
    id: number;
    name: string;
    [key: string]: any;
}

export interface User {
    id: number;
    name: string;
    [key: string]: any;
}

export interface Event {
    id: number;
    title: string;
    description?: string;
    event_type_id: number;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    location?: string;
    status: string;
    approved_by?: number;
    eventType?: EventType;
    approvedBy?: User;
    created_at: string;
    [key: string]: any;
}

export interface CreateEventFormData {
    title: string;
    description: string;
    event_type_id: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    location: string;
    status: string;
    approved_by: string;
    [key: string]: any;
}

export interface EditEventFormData {
    title: string;
    description: string;
    event_type_id: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    location: string;
    status: string;
    approved_by: string;
    [key: string]: any;
}

export interface EventFilters {
    title: string;
    description: string;
    location: string;
    status: string;
    [key: string]: any;
}

export type PaginatedEvents = PaginatedData<Event>;
export type EventModalState = ModalState<Event>;

export interface EventsIndexProps {
    events: PaginatedEvents;
    auth: AuthContext;
    eventtypes: any[];
    users: any[];
    [key: string]: any;
}

export interface CreateEventProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditEventProps {
    event: Event;
    onSuccess: () => void;
    [key: string]: any;
}

export interface EventShowProps {
    event: Event;
    [key: string]: any;
}