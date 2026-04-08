import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface EventType {
    id: number;
    event_type: string;
    created_at: string;
    [key: string]: any;
}

export interface EventTypeFormData {
    event_type: string;
    [key: string]: any;
}

export interface CreateEventTypeProps extends CreateProps  {[key: string]: any;
}

export interface EditEventTypeProps extends EditProps<EventType>  {[key: string]: any;
}

export type PaginatedEventTypes = PaginatedData<EventType>;
export type EventTypeModalState = ModalState<EventType>;

export interface EventTypesIndexProps {
    eventtypes: PaginatedEventTypes;
    auth: AuthContext;
    [key: string]: any;
}