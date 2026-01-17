import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            navigate('/chat');
        } catch (err) {
            setError(err instanceof Error ? err.message : t('invalidCredentials'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-light flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-hero-1/20 selection:text-text-dark">
            <div className="absolute top-8 left-8">
                <Link to="/" className="flex items-center text-text-dark hover:text-hero-1 transition-colors font-medium">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    {t('backToHome')}
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-hero-1 to-hero-2 bg-clip-text text-transparent">
                        JauapAI
                    </span>
                    <h2 className="mt-6 text-3xl font-extrabold text-text-dark">
                        {t('welcomeBack')}
                    </h2>
                    <p className="mt-2 text-sm text-text-dark/60">
                        {t('signInToContinue')}
                    </p>
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-hero-1/5 sm:rounded-2xl sm:px-10 border border-white/50">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-dark">
                                {t('emailAddress')}
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-hero-1/50 focus:border-hero-1 sm:text-sm transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text-dark">
                                {t('password')}
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-hero-1/50 focus:border-hero-1 sm:text-sm transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-hero-1 focus:ring-hero-1 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-dark/80">
                                    {t('rememberMe')}
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-hero-1 hover:text-hero-2">
                                    {t('forgotPassword')}
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-cta hover:bg-cta-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cta transition-all transform hover:scale-[1.02] shadow-cta/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? t('signingIn') : t('signIn')}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center text-sm text-text-dark/60">
                    <p>
                        {t('dontHaveAccount')}{' '}
                        <Link to="/register" className="font-medium text-hero-1 hover:text-hero-2 transition-colors">
                            {t('signUpFree')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
