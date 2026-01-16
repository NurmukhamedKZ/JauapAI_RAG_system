export interface User {
    id: string;
    email: string;
    full_name: string | null;
    is_active: boolean;
    subscription_tier: string;
    created_at: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    full_name?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in?: number;
    expires_at?: number;
    refresh_token: string;
    user: {
        id: string;
        email: string;
        user_metadata: {
            full_name?: string;
            avatar_url?: string;
        };
    };
}

export interface GoogleAuthResponse {
    url: string;
}

export interface UserResponse {
    id: string;
    email: string;
    full_name: string | null;
    is_active: boolean;
    subscription_tier: string;
    created_at: string;
}
