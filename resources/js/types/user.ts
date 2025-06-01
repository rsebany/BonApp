export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at: string | null;
    phone: string | null;
    role: 'admin' | 'customer' | 'driver';
    avatar_url?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Customer extends User {
    role: 'customer';
    delivery_notes?: string;
    favorite_restaurants?: number[];
    payment_methods?: PaymentMethodData[];
}

export interface Driver extends User {
    role: 'driver';
    driver_license: string;
    vehicle_type: string;
    vehicle_plate: string;
    is_available: boolean;
    current_location?: GeoLocation;
}

export interface Admin extends User {
    role: 'admin';
    permissions: string[];
}

export type GeoLocation = {
    lat: number;
    lng: number;
    last_updated: string;
};

