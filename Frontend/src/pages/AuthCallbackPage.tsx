import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveToken } from '../services/api';

const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            // Check for hash (implicit flow)
            const hash = window.location.hash;

            // Check for search query (PKCE flow or errors)
            const search = window.location.search;
            const urlParams = new URLSearchParams(search);
            const code = urlParams.get('code');
            const errorParam = urlParams.get('error');
            const errorDesc = urlParams.get('error_description');

            // Handle URL-based errors from provider
            if (errorParam) {
                console.error("Auth Error:", errorParam, errorDesc);
                setError(`Authentication Error: ${errorDesc || errorParam}`);
                return;
            }

            // PKCE Flow (Code)
            if (code) {
                try {
                    // Exchange code for session via backend
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/callback`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ code }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.detail || 'Failed to exchange code');
                    }

                    const data = await response.json();

                    if (data.access_token) {
                        saveToken(data.access_token);
                        window.location.href = '/chat';
                        return;
                    }

                    throw new Error('No access token received');
                } catch (err) {
                    setError(`Failed to log in: ${err instanceof Error ? err.message : 'Unknown error'}`);
                    console.error("Auth exchange error:", err);
                }
                return;
            }

            // Implicit Flow (Hash)
            if (hash) {
                const params = new URLSearchParams(hash.substring(1)); // remove '#'
                const accessToken = params.get('access_token');
                // const refreshToken = params.get('refresh_token');

                if (accessToken) {
                    saveToken(accessToken);
                    window.location.href = '/chat';
                } else {
                    // Hash present but no access token? 
                    // Could be error in hash like #error=...
                    const hashError = params.get('error');
                    const hashErrorDesc = params.get('error_description');
                    if (hashError) {
                        setError(`Authentication Error: ${hashErrorDesc || hashError}`);
                    } else {
                        setError("No access token found in URL fragment");
                    }
                }
                return;
            }

            // No auth data found
            setError("No authentication data found in URL. Check Supabase Redirect settings.");
        };

        handleCallback();
    }, [navigate, logout]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-light">
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
                {error ? (
                    <>
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Login Failed</h2>
                        <p className="text-gray-600 mb-6 font-mono text-sm break-words bg-gray-50 p-3 rounded">{error}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-hero-1 text-white py-3 rounded-xl font-semibold hover:bg-hero-1/90 transition-colors"
                        >
                            Back to Login
                        </button>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 border-4 border-hero-1 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-text-dark">Authenticating...</h2>
                        <p className="text-text-dark/60 mt-2">Please wait while we log you in.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthCallbackPage;
