import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, CheckCircle, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import GoogleLoginButton, { isGoogleOAuthConfigured } from '../components/auth/GoogleLoginButton';

interface RegisterResponse {
    message: string;
    email: string;
    requires_verification: boolean;
}

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registrationComplete, setRegistrationComplete] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    const { t, language } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post<RegisterResponse>('/auth/register', {
                email,
                password,
                full_name: fullName
            }, false);

            if (response.requires_verification) {
                setRegistrationComplete(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : t('registrationFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setResendLoading(true);
        setResendSuccess(false);

        try {
            await api.post('/auth/resend-verification', { email }, false);
            setResendSuccess(true);
        } catch {
            // Silently handle - the endpoint always returns success message
            setResendSuccess(true);
        } finally {
            setResendLoading(false);
        }
    };

    // Show verification pending screen after registration
    if (registrationComplete) {
        return (
            <div className="min-h-screen bg-void flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-glow/30 selection:text-white relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-deep/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="absolute top-8 left-8 z-20">
                    <Link to="/" className="flex items-center text-text-muted hover:text-emerald-glow transition-colors font-medium">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        {t('backToHome')}
                    </Link>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                    <div className="text-center mb-8">
                        <span className="text-3xl font-bold font-heading text-text-main">
                            Jauap<span className="text-emerald-glow">AI</span>
                        </span>
                    </div>

                    <div className="glass-card py-12 px-8 shadow-2xl rounded-2xl border border-white/5 bg-surface/30 backdrop-blur-xl text-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-glow/20 flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-10 h-10 text-emerald-glow" />
                        </div>

                        <h2 className="text-2xl font-bold text-text-main mb-4">
                            {language === 'kk' ? 'Email-ды тексеріңіз' : language === 'ru' ? 'Проверьте вашу почту' : 'Check your email'}
                        </h2>

                        <p className="text-text-dim mb-2">
                            {language === 'kk' ? 'Біз растау сілтемесін жібердік:' : language === 'ru' ? 'Мы отправили ссылку для подтверждения на:' : 'We sent a verification link to:'}
                        </p>

                        <p className="text-emerald-glow font-medium text-lg mb-6">
                            {email}
                        </p>

                        <p className="text-text-dim text-sm mb-8">
                            {language === 'kk'
                                ? 'Сілтемеге басып email-ды растаңыз, содан кейін кіре аласыз.'
                                : language === 'ru'
                                    ? 'Перейдите по ссылке в письме, чтобы подтвердить email и войти в систему.'
                                    : 'Click the link in the email to verify your account and log in.'}
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={handleResendVerification}
                                disabled={resendLoading || resendSuccess}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-emerald-glow transition-colors disabled:opacity-50"
                            >
                                {resendSuccess ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 text-emerald-glow" />
                                        {language === 'kk' ? 'Хат жіберілді!' : language === 'ru' ? 'Письмо отправлено!' : 'Email sent!'}
                                    </>
                                ) : (
                                    <>
                                        <Send className={`w-4 h-4 ${resendLoading ? 'animate-pulse' : ''}`} />
                                        {language === 'kk' ? 'Қайта жіберу' : language === 'ru' ? 'Отправить повторно' : 'Resend email'}
                                    </>
                                )}
                            </button>

                            <div>
                                <Link
                                    to="/login"
                                    className="text-emerald-glow hover:text-emerald-400 font-medium transition-colors"
                                >
                                    {language === 'kk' ? 'Кіру бетіне өту' : language === 'ru' ? 'Перейти к входу' : 'Go to login'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                        {t('createAccount')}
                    </h2>
                    <p className="mt-2 text-sm text-text-dim">
                        {t('startJourney')}
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
                            <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-1">
                                {t('fullNameLabel')}
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-text-dim" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-surface/50 text-text-main placeholder-text-dim focus:outline-none focus:ring-2 focus:ring-emerald-glow/50 focus:border-emerald-glow/50 sm:text-sm transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

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
                                    autoComplete="new-password"
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

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                className="h-4 w-4 text-emerald-glow focus:ring-emerald-glow border-white/10 rounded bg-surface/50"
                                required
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-text-muted">
                                {t('iAgreeTo')}{' '}
                                <a href="#" className="font-medium text-emerald-glow hover:text-emerald-400">
                                    {t('termsOfService')}
                                </a>{' '}
                                {t('and')}{' '}
                                <a href="#" className="font-medium text-emerald-glow hover:text-emerald-400">
                                    {t('privacyPolicy')}
                                </a>
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] text-sm font-bold text-void bg-emerald-glow hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-glow transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? t('creatingAccount') : t('createAccount')}
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
                        {t('alreadyHaveAccount')}{' '}
                        <Link to="/login" className="font-medium text-emerald-glow hover:text-emerald-400 transition-colors">
                            {t('signIn')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
