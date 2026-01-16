import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state and listen to changes
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('Initial session:', session);
            if (session?.user) {
                console.log('User from session:', session.user);
                console.log('User metadata:', session.user.user_metadata);
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
                    is_active: true,
                    subscription_tier: 'free',
                    created_at: session.user.created_at,
                });
            } else {
                console.log('No session user found');
            }
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session);
            if (session?.user) {
                console.log('Setting user from auth change:', session.user);
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
                    is_active: true,
                    subscription_tier: 'free',
                    created_at: session.user.created_at,
                });
            } else {
                console.log('Clearing user');
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (data: LoginRequest) => {
        setLoading(true);
        try {
            await authService.login(data);
            // User will be set by onAuthStateChange
        } catch (error) {
            setLoading(false);
            throw error;
        }
        setLoading(false);
    };

    const register = async (data: RegisterRequest) => {
        setLoading(true);
        try {
            await authService.register(data);
            // User will be set by onAuthStateChange
        } catch (error) {
            setLoading(false);
            throw error;
        }
        setLoading(false);
    };

    const logout = async () => {
        await authService.logout();
        // User will be cleared by onAuthStateChange
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
