import { supabase } from '../lib/supabase';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';

// Authentication service using Supabase
export const authService = {
    // Register a new user
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.full_name || null,
                },
            },
        });

        if (error) throw new Error(error.message);
        if (!authData.session) throw new Error('Registration failed');

        return {
            access_token: authData.session.access_token,
            token_type: 'bearer',
            expires_in: authData.session.expires_in,
            expires_at: authData.session.expires_at,
            refresh_token: authData.session.refresh_token,
            user: {
                id: authData.user!.id,
                email: authData.user!.email!,
                user_metadata: authData.user!.user_metadata,
            },
        };
    },

    // Login user
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) throw new Error(error.message);
        if (!authData.session) throw new Error('Login failed');

        return {
            access_token: authData.session.access_token,
            token_type: 'bearer',
            expires_in: authData.session.expires_in,
            expires_at: authData.session.expires_at,
            refresh_token: authData.session.refresh_token,
            user: {
                id: authData.user.id,
                email: authData.user.email!,
                user_metadata: authData.user.user_metadata,
            },
        };
    },

    // Login with Google
    loginWithGoogle: async (): Promise<void> => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) throw new Error(error.message);
    },

    // Logout user
    logout: async (): Promise<void> => {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    },

    // Get current user profile
    getCurrentUser: async (): Promise<User> => {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) throw new Error(error.message);
        if (!user) throw new Error('No user logged in');

        return {
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || null,
            is_active: true,
            subscription_tier: 'free', // Default tier
            created_at: user.created_at,
        };
    },

    // Get access token
    getAccessToken: async (): Promise<string | null> => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || null;
    },

    // Check if user is authenticated
    isAuthenticated: async (): Promise<boolean> => {
        const { data: { session } } = await supabase.auth.getSession();
        return !!session;
    },
};
