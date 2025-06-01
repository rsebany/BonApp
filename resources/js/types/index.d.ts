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
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}


    
    
    
