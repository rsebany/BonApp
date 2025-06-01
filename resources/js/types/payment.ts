// resources/js/types/payment.ts
export interface PaymentMethod {
    id: number;
    type: 'card' | 'paypal' | 'apple_pay';
    last_four?: string;
    is_default: boolean;
    card_brand?: string;
    expiry_date?: string;
}

export interface Transaction {
    id: number;
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    payment_method: PaymentMethod;
    order_id: number;
    created_at: string;
}