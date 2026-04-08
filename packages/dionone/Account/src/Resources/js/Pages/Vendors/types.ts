import { PaginatedData, ModalState, AuthContext } from '@/types/common';

export interface Address {
    name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    [key: string]: any;
}

export interface Vendor {
    id: number;
    user_id?: number;
    vendor_code: string;
    company_name: string;
    contact_person_name: string;
    contact_person_email?: string;
    contact_person_mobile?: string;
    primary_email?: string;
    primary_mobile?: string;
    tax_number?: string;
    payment_terms?: string;
    currency_code: string;
    credit_limit?: number;
    billing_address: Address;
    shipping_address: Address;
    same_as_billing: boolean;
    is_active: boolean;
    notes?: string;
    created_at: string;
    [key: string]: any;
}

export interface CreateVendorFormData {
    user_id?: string;
    company_name: string;
    contact_person_name: string;
    contact_person_email: string;
    contact_person_mobile: string;
    tax_number: string;
    payment_terms: string;
    billing_address: Address;
    shipping_address: Address;
    same_as_billing: boolean;
    notes: string;
    [key: string]: any;
}

export interface User {
    id: number;
    name: string;
    email: string;
    mobile_no?: string;
    [key: string]: any;
}

export interface VendorFilters {
    company_name: string;
    vendor_code: string;
    contact_person_name: string;
    [key: string]: any;
}

export type PaginatedVendors = PaginatedData<Vendor>;
export type VendorModalState = ModalState<Vendor>;

export interface VendorsIndexProps {
    vendors: PaginatedVendors;
    users: User[];
    auth: AuthContext;
    [key: string]: any;
}

export interface CreateVendorProps {
    onSuccess: () => void;
    users?: User[];
    auth?: any;
    [key: string]: any;
}

export interface EditVendorProps {
    vendor: Vendor;
    onSuccess: () => void;
    [key: string]: any;
}