import { supabase } from '../lib/supabase';

// Base API configuration and utilities

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface RequestOptions extends RequestInit {
    requiresAuth?: boolean;
}

const ApiError = class extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
};

// Get token from Supabase session
export const getToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
};

// Save token (no longer needed with Supabase, but kept for compatibility)
export const saveToken = (token: string): void => {
    // Tokens are managed by Supabase
    console.warn('saveToken is deprecated when using Supabase');
};

// Remove token (no longer needed with Supabase, but kept for compatibility)
export const removeToken = (): void => {
    // Tokens are managed by Supabase
    console.warn('removeToken is deprecated when using Supabase');
};

// Generic fetch wrapper
async function apiFetch<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { requiresAuth = false, headers = {}, ...restOptions } = options;

    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(headers as Record<string, string>),
    };

    // Add authorization header if required
    if (requiresAuth) {
        const token = await getToken();
        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...restOptions,
            headers: requestHeaders,
        });

        // Handle non-OK responses
        if (!response.ok) {
            let errorMessage = 'An error occurred';
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorData.message || errorMessage;
            } catch {
                errorMessage = response.statusText || errorMessage;
            }
            throw new ApiError(response.status, errorMessage);
        }

        // Parse JSON response
        const data = await response.json();
        return data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        // Network or other errors
        throw new Error('Network error. Please check your connection.');
    }
}

// Exported API methods
export const api = {
    get: <T>(endpoint: string, requiresAuth = false): Promise<T> =>
        apiFetch<T>(endpoint, { method: 'GET', requiresAuth }),

    post: <T>(
        endpoint: string,
        data?: unknown,
        requiresAuth = false
    ): Promise<T> =>
        apiFetch<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            requiresAuth,
        }),

    put: <T>(
        endpoint: string,
        data?: unknown,
        requiresAuth = false
    ): Promise<T> =>
        apiFetch<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            requiresAuth,
        }),

    delete: <T>(endpoint: string, requiresAuth = false): Promise<T> =>
        apiFetch<T>(endpoint, { method: 'DELETE', requiresAuth }),
};

export { ApiError };
