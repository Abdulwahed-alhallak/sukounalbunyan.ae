export interface Unit {
    id: number;
    unit_name: string;
    created_at: string;
    [key: string]: any;
}

export interface UnitsIndexProps {
    units: Unit[];
    auth: {
        user: {
            permissions: string[];
            [key: string]: any;
        };
    };
}

export interface UnitModalState {
    isOpen: boolean;
    mode: string;
    data: Unit | null;
    [key: string]: any;
}

export interface UnitFormData {
    unit_name: string;
    [key: string]: any;
}

export interface UnitCreateProps {
    onSuccess: () => void;
    [key: string]: any;
}

export interface UnitEditProps {
    unit: Unit;
    onSuccess: () => void;
    [key: string]: any;
}
