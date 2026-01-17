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
};
