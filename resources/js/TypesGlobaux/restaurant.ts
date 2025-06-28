import { Address } from "cluster";
import { ReactNode } from "react";

export interface Review {
    id: number;
    user_name: string;
    rating: number;
    comment?: string;
    is_verified: boolean;
    created_at: string;
}

export interface Restaurant {
    phone: string;
    restaurant_name: ReactNode;
    id: number;
    name: string;
    description: string;
    address: Address;
    cuisine_type: string;
    rating: number;
    delivery_time: string;
    min_order: number;
    logo_url: string;
    cover_url: string;
    is_open: boolean;
    review_count?: number;
    reviews?: Review[];
}

export interface MenuCategory {
    id: number;
    name: string;
    items: MenuItem[];
}

export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    is_available: boolean;
    ingredients?: string[];
    category_id: number;
}