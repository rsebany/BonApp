import { Order } from "./order";
import { MenuItem, Restaurant } from "./restaurant";

export interface RestaurantCardProps {
    restaurant: Restaurant;
    showDetails?: boolean;
    onSelect?: (id: number) => void;
}

export interface MenuItemProps {
    item: MenuItem;
    onAddToCart?: (item: MenuItem) => void;
    variant?: 'compact' | 'detailed';
}

export interface OrderStatusBadgeProps {
    status: Order['status'];
    withIcon?: boolean;
}