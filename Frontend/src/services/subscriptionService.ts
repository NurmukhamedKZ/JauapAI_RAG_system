// Subscription service for managing user plans and usage

import { api } from './api';

export interface SubscriptionStatus {
    plan: string;
    message_count: number;
    message_limit: number;
    messages_remaining: number;
    reset_date: string;
}

export interface ToggleResponse {
    new_plan: string;
    message: string;
}

export interface PaymentLink {
    telegram_link: string;
    bot_username: string;
    price_stars: number;
}

export interface PaymentStatus {
    has_pending_payment: boolean;
    last_payment_status: string | null;
    last_payment_date: string | null;
}

export const subscriptionService = {
    /**
     * Get current subscription status including message usage
     */
    getStatus: async (): Promise<SubscriptionStatus> => {
        return api.get<SubscriptionStatus>('/subscription/status', true);
    },

    /**
     * Toggle between free and pro plans (for testing only)
     */
    togglePlan: async (): Promise<ToggleResponse> => {
        return api.post<ToggleResponse>('/subscription/toggle', null, true);
    },

    /**
     * Get Telegram payment link for Pro subscription
     */
    getPaymentLink: async (): Promise<PaymentLink> => {
        return api.get<PaymentLink>('/payments/link', true);
    },

    /**
     * Get payment status for current user
     */
    getPaymentStatus: async (): Promise<PaymentStatus> => {
        return api.get<PaymentStatus>('/payments/status', true);
    },
};
