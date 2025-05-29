export interface MenuItem {
  id: number;
  restaurant_id: number;
  item_name: string;
  price: number;
}

export interface Restaurant {
  id: number;
  restaurant_name: string;
  address_id: number;
  address: Address;
  menu_items?: MenuItem[];
}

export interface Address {
  id: number;
  unit_number: string | null;
  street_number: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  region: string;
  postal_code: string;
  country_id: number;
  country?: Country;
}

export interface Country {
  id: number;
  country_name: string;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  addresses?: CustomerAddress[];
}

export interface CustomerAddress {
  id: number;
  customer_id: number;
  address_id: number;
  address: Address;
}

export interface OrderStatus {
  id: number;
  status_name: string;
}

export interface Driver {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  vehicle_type: string;
}

export interface FoodOrder {
  id: number;
  customer_id: number;
  restaurant_id: number;
  customer_address_id: number;
  order_status_id: number;
  assigned_driver_id: number | null;
  order_date_time: string;
  delivery_fee: number;
  total_amount: number;
  requested_delivery_date_time: string | null;
  cust_driver_rating: number | null;
  cust_restaurant_rating: number | null;
  
  // Relationships
  customer?: Customer;
  restaurant?: Restaurant;
  customer_address?: CustomerAddress;
  status?: OrderStatus;
  driver?: Driver;
  menu_items?: {
    id: number;
    qty_ordered: number;
    menu_item: MenuItem;
  }[];
}

export interface OrderMenuItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  qty_ordered: number;
  menu_item?: MenuItem;
}