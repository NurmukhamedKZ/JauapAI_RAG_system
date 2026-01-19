/**
 * Vote service for subject preference tracking
 */
import { api } from './api';

export interface VoteResponse {
    success: boolean;
    message: string;
}

export interface VoteStats {
    subject: string;
    count: number;
}

/**
 * Submit a vote for a subject to be added next
 */
export const submitVote = async (subject: string): Promise<VoteResponse> => {
    return api.post<VoteResponse>('/vote', { subject }, true);
};

/**
 * Get vote statistics (admin only)
 */
export const getVoteStats = async (): Promise<VoteStats[]> => {
    return api.get<VoteStats[]>('/votes/stats', true);
};

