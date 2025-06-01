import { Address } from "cluster";
import { GeoLocation } from "./user";

// resources/js/types/order.ts
export interface Order {
    id: number;
    customer_id: number;
    restaurant_id: number;
    driver_id?: number;
    status: OrderStatus;
    items: OrderItem[];
    delivery_address: Address;
    subtotal: number;
    delivery_fee: number;
    tax: number;
    total: number;
    created_at: string;
    scheduled_for?: string;
    special_instructions?: string;
}

export interface OrderItem {
    menu_item_id: number;
    quantity: number;
    unit_price: number;
    notes?: string;
}

export type OrderStatus = 
    'pending' | 
    'confirmed' | 
    'preparing' | 
    'ready' | 
    'picked_up' | 
    'delivered' | 
    'cancelled';

export interface OrderTracking {
    status: OrderStatus;
    estimated_delivery_time?: string;
    driver_location?: GeoLocation;
    status_history: StatusUpdate[];
}

export interface StatusUpdate {
    status: OrderStatus;
    timestamp: string;
    note?: string;
}