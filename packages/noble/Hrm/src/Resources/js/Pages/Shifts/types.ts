import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface User {
    id: number;
    name: string;
    [key: string]: any;
}

export interface Shift {
    id: number;
    shift_name: string;
    start_time: string;
    end_time: string;
    break_start_time?: string;
    break_end_time?: string;
    is_night_shift: boolean;
    creator_id: number;
    created_by?: string;
    creator?: User;
    created_at: string;
    [key: string]: any;
}

export interface CreateShiftFormData {
    shift_name: string;
    start_time: string;
    end_time: string;
    break_start_time: string;
    break_end_time: string;
    is_night_shift: boolean;
    creator_id: string;
    created_by: string;
    [key: string]: any;
}

export interface EditShiftFormData {
    shift_name: string;
    start_time: string;
    end_time: string;
    break_start_time: string;
    break_end_time: string;
    is_night_shift: boolean;
    creator_id: string;
    created_by: string;
    [key: string]: any;
}

export interface ShiftFilters {
    shift_name: string;
    created_by: string;
    creator_id: string;
    [key: string]: any;
}

export type PaginatedShifts = PaginatedData<Shift>;
export type ShiftModalState = ModalState<Shift>;

export interface ShiftsIndexProps {
    shifts: PaginatedShifts;
    auth: AuthContext;
    users: any[];
    [key: string]: any;
}

export interface CreateShiftProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface EditShiftProps {
    shift: Shift;
    onSuccess: () => void;
    [key: string]: any;
}

export interface ShiftShowProps {
    shift: Shift;
    [key: string]: any;
}
