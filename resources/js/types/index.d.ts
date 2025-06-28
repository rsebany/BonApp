import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface User {
    [x: string]: string | undefined;
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


export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    as?: 'a' | 'button';
    children?: NavItem[];
}
export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
    featuredRestaurants: BackendRestaurant[];
    popularCategories: PopularCategory[];
    localFavorites: BackendRestaurant[];
}
    
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export interface Country {
    id: number;
    country_name: string;
    country_code: string;
}

export interface Address {
    id: number;
    address_line1: string;
    address_line2: string | null;
    city: string;
    region: string;
    postal_code: string;
    country: Country;
}

export interface BackendRestaurant {
    id: number;
    restaurant_name: string;
    description: string;
    cuisine_type: string;
    delivery_time: string;
    address: Address;
    rating?: number;
    price_range?: string;
    image?: string;
    tags?: string[];
    featured_dish?: string;
    latitude?: number;
    longitude?: number;
    distance_km?: number;
    distance_miles?: number;
}

export interface Restaurant extends BackendRestaurant {
    rating: number; 
    priceRange: string;
    image: string;
    tags: string[];
    featuredDish: string;
    distance: string;
}

export interface PopularCategory {
    id: number;
    name: string;
    count: number;
    icon: string;
    image: string;
}