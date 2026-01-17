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
        <div className="min-h-screen flex items-center justify-center bg-bg-light">
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
                <div className="w-16 h-16 border-4 border-hero-1 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-text-dark">Redirecting...</h2>
            </div>
        </div>
    );
};

export default AuthCallbackPage;
