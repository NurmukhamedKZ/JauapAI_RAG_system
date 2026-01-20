import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthCallbackPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        if (authService.isAuthenticated()) {
            navigate('/chat');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-void">
            <div className="text-center p-8 glass-card rounded-2xl shadow-xl max-w-md w-full border border-white/5 bg-surface/30 backdrop-blur-md">
                <div className="w-16 h-16 border-4 border-emerald-glow/30 border-t-emerald-glow rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-xl font-semibold text-text-main animate-pulse">Redirecting to Portal...</h2>
            </div>
        </div>
    );
};

export default AuthCallbackPage;
