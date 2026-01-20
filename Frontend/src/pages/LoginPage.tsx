import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import GoogleLoginButton, { isGoogleOAuthConfigured } from '../components/auth/GoogleLoginButton';

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
        <div className="min-h-screen bg-void flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-glow/30 selection:text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-deep/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="absolute top-8 left-8 z-20">
                <Link to="/" className="flex items-center text-text-muted hover:text-emerald-glow transition-colors font-medium">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    {t('backToHome')}
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="text-center">
                    <span className="text-3xl font-bold font-heading text-text-main">
                        Jauap<span className="text-emerald-glow">AI</span>
                    </span>
                    <h2 className="mt-6 text-3xl font-extrabold text-text-main font-heading">
                        {t('welcomeBack')}
                    </h2>
                    <p className="mt-2 text-sm text-text-dim">
                        {t('signInToContinue')}
                    </p>
                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="glass-card py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/5 bg-surface/30 backdrop-blur-xl">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-1">
                                {t('emailAddress')}
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-text-dim" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-surface/50 text-text-main placeholder-text-dim focus:outline-none focus:ring-2 focus:ring-emerald-glow/50 focus:border-emerald-glow/50 sm:text-sm transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text-muted mb-1">
                                {t('password')}
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-text-dim" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border border-white/10 rounded-xl leading-5 bg-surface/50 text-text-main placeholder-text-dim focus:outline-none focus:ring-2 focus:ring-emerald-glow/50 focus:border-emerald-glow/50 sm:text-sm transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-text-dim hover:text-text-muted" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-text-dim hover:text-text-muted" />
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
                                    className="h-4 w-4 text-emerald-glow focus:ring-emerald-glow border-white/10 rounded bg-surface/50"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-muted">
                                    {t('rememberMe')}
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-emerald-glow hover:text-emerald-400">
                                    {t('forgotPassword')}
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] text-sm font-bold text-void bg-emerald-glow hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-glow transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? t('signingIn') : t('signIn')}
                            </button>
                        </div>
                    </form>

                    {/* Google Sign-In - Only show if configured */}
                    {isGoogleOAuthConfigured && (
                        <GoogleLoginButton
                            onError={setError}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    )}
                </div>

                <div className="mt-8 text-center text-sm text-text-dim">
                    <p>
                        {t('dontHaveAccount')}{' '}
                        <Link to="/register" className="font-medium text-emerald-glow hover:text-emerald-400 transition-colors">
                            {t('signUpFree')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
