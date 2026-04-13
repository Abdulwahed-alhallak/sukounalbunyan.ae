import { PaginatedData, ModalState, AuthContext, CreateProps, EditProps } from '@/types/common';

export interface HolidayType {
    id: number;
    holiday_type: string;
    created_at: string;
    [key: string]: any;
}

export interface HolidayTypeFormData {
    holiday_type: string;
    [key: string]: any;
}

export interface CreateHolidayTypeProps extends CreateProps {
    [key: string]: any;
}

export interface EditHolidayTypeProps extends EditProps<HolidayType> {
    [key: string]: any;
}

export type PaginatedHolidayTypes = PaginatedData<HolidayType>;
export type HolidayTypeModalState = ModalState<HolidayType>;

export interface HolidayTypesIndexProps {
    holidaytypes: PaginatedHolidayTypes;
    auth: AuthContext;
    [key: string]: any;
}
