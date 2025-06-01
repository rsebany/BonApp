// resources/js/types/review.ts
export interface Review {
    id: number;
    order_id: number;
    user_id: number;
    rating: number;
    comment?: string;
    created_at: string;
}

export interface RestaurantReview extends Review {
    restaurant_id: number;
    food_quality: number;
    service: number;
}

export interface DriverReview extends Review {
    driver_id: number;
    punctuality: number;
    courtesy: number;
}