// resources/js/types/address.ts
export interface Address {
    id: number;
    line1: string;
    line2?: string;
    city: string;
    postal_code: string;
    country: string;
    is_default: boolean;
    instructions?: string;
    latitude?: number;
    longitude?: number;
}