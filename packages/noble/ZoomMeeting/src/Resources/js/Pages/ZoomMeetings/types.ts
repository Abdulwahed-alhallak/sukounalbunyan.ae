import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface User {
    id: number;
    name: string;
    avatar?: string;
    [key: string]: any;
}

export interface ZoomMeeting {
    id: number;
    title: string;
    description?: string;
    meeting_id?: string;
    meeting_password?: string;
    start_time: any;
    duration: number;
    host_video: boolean;
    participant_video: boolean;
    waiting_room: boolean;
    recording: boolean;
    status: string;
    participants?: string[];
    host_id?: number;
    host?: User;
    join_url?: string;
    start_url?: string;
    created_at: string;
    [key: string]: any;
}

export interface CreateZoomMeetingFormData {
    title: string;
    description: string;
    meeting_password: string;
    start_time: any;
    duration: string;
    host_video: boolean;
    participant_video: boolean;
    waiting_room: boolean;
    recording: boolean;
    status: string;
    participants: string[];
    host_id: string;
    sync_to_google_calendar: boolean;
    [key: string]: any;
}

export interface EditZoomMeetingFormData {
    title: string;
    description: string;
    meeting_password: string;
    start_time: any;
    duration: string;
    host_video: boolean;
    participant_video: boolean;
    waiting_room: boolean;
    recording: boolean;
    status: string;
    participants: string[];
    host_id: string;
    [key: string]: any;
}

export interface ZoomMeetingFilters {
    title: string;
    description: string;
    meeting_id: string;
    status: string;
    host_video: string;
    participant_video: string;
    recording: string;
    date_range: string;
    [key: string]: any;
}

export type PaginatedZoomMeetings = PaginatedData<ZoomMeeting>;
export type ZoomMeetingModalState = ModalState<ZoomMeeting>;

export interface ZoomMeetingsIndexProps {
    zoommeetings: PaginatedZoomMeetings;
    auth: AuthContext;
    users: any[];
    [key: string]: any;
}

export interface CreateZoomMeetingProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditZoomMeetingProps {
    zoommeeting: ZoomMeeting;
    onSuccess: () => void;
    [key: string]: any;
}

export interface ZoomMeetingShowProps {
    zoommeeting: ZoomMeeting;
    [key: string]: any;
}
