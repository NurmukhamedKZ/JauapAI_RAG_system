import { api, saveToken, removeToken, getToken } from './api';
import type { LoginRequest, RegisterRequest, User } from '../types/auth';

interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

// Authentication service using backend API
export const authService = {
    // Register a new user
    register: async (data: RegisterRequest): Promise<TokenResponse> => {
        const response = await api.post<TokenResponse>('/auth/register', data);

        // Save the access token
        if (response.access_token) {
            saveToken(response.access_token);
        }

        return response;
    },

    // Login user
    login: async (data: LoginRequest): Promise<TokenResponse> => {
        const response = await api.post<TokenResponse>('/auth/login', data);

        // Save the access token
        if (response.access_token) {
            saveToken(response.access_token);
        }

        return response;
    },

    // Logout user
    logout: (): void => {
        removeToken();
    },

    // Get current user profile
    getCurrentUser: async (): Promise<User> => {
        return api.get<User>('/auth/me', true);
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        return !!getToken();
    },
};
