import { Address } from "cluster";

export interface Restaurant {
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