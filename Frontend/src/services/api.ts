// Base API configuration and utilities

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

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

// Get token from localStorage
export const getToken = (): string | null => {
    return localStorage.getItem('access_token');
};

// Save token to localStorage
export const saveToken = (token: string): void => {
    localStorage.setItem('access_token', token);
};

// Remove token from localStorage
export const removeToken = (): void => {
    localStorage.removeItem('access_token');
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
        const token = getToken();
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
