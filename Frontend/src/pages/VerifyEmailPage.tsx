import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const { t } = useLanguage();

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Verification token is missing');
            return;
        }

        verifyEmail(token);
    }, [searchParams]);

    const verifyEmail = async (token: string) => {
        try {
            const response = await api.post<{ message: string; verified: boolean }>(
                '/auth/verify-email',
                { token },
                false
            );

            if (response.verified) {
                setStatus('success');
                setMessage(response.message);
            } else {
                setStatus('error');
                setMessage(response.message);
            }
        } catch (error) {
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Verification failed');
        }
    };

    return (
        <div className="min-h-screen bg-void flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-glow/30 selection:text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-deep/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="text-center mb-8">
                    <span className="text-3xl font-bold font-heading text-text-main">
                        Jauap<span className="text-emerald-glow">AI</span>
                    </span>
                </div>

                <div className="glass-card py-12 px-8 shadow-2xl rounded-2xl border border-white/5 bg-surface/30 backdrop-blur-xl text-center">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="w-16 h-16 text-emerald-glow animate-spin mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-text-main mb-2">
                                {t('verifyingEmail') || 'Verifying your email...'}
                            </h2>
                            <p className="text-text-dim">
                                {t('pleaseWait') || 'Please wait a moment'}
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="w-20 h-20 rounded-full bg-emerald-glow/20 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-12 h-12 text-emerald-glow" />
                            </div>
                            <h2 className="text-2xl font-bold text-text-main mb-2">
                                {t('emailVerified') || 'Email Verified!'}
                            </h2>
                            <p className="text-text-dim mb-8">
                                {message || t('emailVerifiedMessage') || 'Your email has been verified successfully. You can now log in.'}
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-glow text-void font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                {t('goToLogin') || 'Go to Login'}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                                <XCircle className="w-12 h-12 text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-text-main mb-2">
                                {t('verificationFailed') || 'Verification Failed'}
                            </h2>
                            <p className="text-text-dim mb-8">
                                {message}
                            </p>
                            <div className="space-y-4">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-surface/50 text-text-main font-semibold rounded-xl hover:bg-surface transition-all border border-white/10"
                                >
                                    {t('backToLogin') || 'Back to Login'}
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
