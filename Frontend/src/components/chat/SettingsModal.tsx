import { X, User, Bell, Shield, LogOut, Crown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { subscriptionService } from '../../services/subscriptionService';
import type { SubscriptionStatus, PaymentLink } from '../../services/subscriptionService';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Language = 'kk' | 'ru';

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { language, setLanguage, t } = useLanguage();
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
    const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadSubscriptionStatus();
        }
    }, [isOpen]);

    const loadSubscriptionStatus = async () => {
        try {
            const status = await subscriptionService.getStatus();
            setSubscriptionStatus(status);

            // Load payment link if user is not pro
            if (status.plan !== 'pro') {
                try {
                    const link = await subscriptionService.getPaymentLink();
                    setPaymentLink(link);
                } catch {
                    // Payment link may not be available if bot is not configured
                    console.log('Payment link not available');
                }
            }
        } catch (error) {
            console.error('Failed to load subscription status:', error);
        }
    };

    const handlePayWithTelegram = () => {
        if (paymentLink?.telegram_link) {
            window.open(paymentLink.telegram_link, '_blank');
        }
    };

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
    };

    const handleLogout = async () => {
        await logout();
        onClose();
        navigate('/');
    };

    const isPro = user?.subscription_tier === 'pro';
    const usagePercent = subscriptionStatus
        ? (subscriptionStatus.message_count / subscriptionStatus.message_limit) * 100
        : 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-50 bg-void flex flex-col"
                >
                    {/* Header */}
                    <div className="border-b border-white/5 bg-surface/30 backdrop-blur-xl sticky top-0 z-10 hidden sm:block">
                        <div className="max-w-4xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-text-main font-heading">{t('settings')}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 rounded-full hover:bg-white/5 transition-colors"
                            >
                                <X className="w-6 h-6 text-text-muted hover:text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-surface/50 sm:hidden z-20 text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>


                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8 pb-20 pt-16 sm:pt-8">

                            {/* Profile Section */}
                            <section>
                                <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-emerald-glow" />
                                    {t('profile')}
                                </h3>
                                <div className="glass-card bg-surface/30 rounded-2xl border border-white/5 p-6 space-y-6 shadow-xl">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-deep to-emerald-glow flex items-center justify-center text-white text-4xl font-bold shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-white/10">
                                            {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-2xl font-bold text-text-main truncate font-heading">
                                                {user?.full_name || user?.email?.split('@')[0] || 'User'}
                                            </h4>
                                            <p className="text-base text-text-dim truncate mt-1">
                                                {user?.email || t('notSet')}
                                            </p>
                                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-sm font-medium text-text-muted border border-white/5">
                                                <Crown className="w-3.5 h-3.5 text-emerald-glow" />
                                                {isPro ? t('proPlan') : t('freePlan')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                        <div className="p-4 rounded-xl bg-surface/50 border border-white/5">
                                            <p className="text-xs text-text-dim mb-1">{t('email')}</p>
                                            <p className="font-medium text-text-main truncate">
                                                {user?.email || t('notSet')}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-surface/50 border border-white/5">
                                            <p className="text-xs text-text-dim mb-1">{t('fullName')}</p>
                                            <p className="font-medium text-text-main truncate">
                                                {user?.full_name || t('notSet')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Subscription Section */}
                            <section>
                                <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-emerald-glow" />
                                    {t('subscription')}
                                </h3>
                                <div className={`rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group border border-white/10 ${isPro ? 'bg-gradient-to-br from-emerald-900/80 to-emerald-600/80 shadow-emerald-500/10' : 'bg-surface/30'}`}>
                                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700">
                                        <Crown className="w-64 h-64" />
                                    </div>

                                    <div className="relative z-10 space-y-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div>
                                                <h4 className="text-3xl font-bold mb-2 font-heading text-white">{isPro ? t('proPlan') : t('freePlan')}</h4>
                                                <p className="text-white/80 text-lg">{isPro ? t('advancedFeatures') : '5 messages per month'}</p>
                                            </div>
                                        </div>

                                        {/* Usage Progress Bar */}
                                        {subscriptionStatus && (
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="flex items-center gap-2 text-white/90">
                                                        <Zap className="w-4 h-4 text-emerald-300" />
                                                        Messages Used
                                                    </span>
                                                    <span className="font-semibold text-white">
                                                        {subscriptionStatus.message_count} / {subscriptionStatus.message_limit}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-black/40 rounded-full h-3 border border-white/10">
                                                    <div
                                                        className={`h-3 rounded-full transition-all duration-500 ${usagePercent >= 80 ? 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]' : 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'}`}
                                                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                                    />
                                                </div>
                                                <p className="text-sm text-white/70">
                                                    {subscriptionStatus.messages_remaining} messages remaining
                                                </p>
                                            </div>
                                        )}

                                        {/* Features & Toggle */}
                                        <div className="flex flex-wrap gap-4 text-sm font-medium">
                                            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 hover:bg-white/20 transition-colors">
                                                {isPro ? '200 messages/month' : '5 messages/month'}
                                            </div>
                                            {isPro && (
                                                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 hover:bg-white/20 transition-colors">
                                                    {t('geminiAccess')}
                                                </div>
                                            )}
                                        </div>

                                        {/* Upgrade or Pro Status */}
                                        <div className="pt-4 border-t border-white/10">
                                            {!isPro ? (
                                                <>
                                                    {paymentLink ? (
                                                        <button
                                                            onClick={handlePayWithTelegram}
                                                            className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#0088cc] to-[#0099dd] hover:from-[#0099dd] hover:to-[#00aaee] text-white rounded-xl py-4 px-6 text-base font-bold transition-all shadow-lg hover:shadow-[#0088cc]/25"
                                                        >
                                                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                                            </svg>
                                                            {language === 'kk' ? 'Pro жазылу' : language === 'ru' ? 'Перейти на Pro' : 'Upgrade to Pro'} — {paymentLink.price_stars} ⭐
                                                        </button>
                                                    ) : (
                                                        <p className="text-sm text-white/50 text-center">
                                                            {language === 'kk' ? 'Төлем жүйесі қол жетімді емес' : language === 'ru' ? 'Система оплаты недоступна' : 'Payment system unavailable'}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-white/50 text-center mt-3">
                                                        {language === 'kk' ? 'Telegram Stars арқылы төлеу' : language === 'ru' ? 'Оплата через Telegram Stars' : 'Pay with Telegram Stars'}
                                                    </p>
                                                </>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2 text-emerald-300 font-medium">
                                                    <Crown className="w-5 h-5" />
                                                    {language === 'kk' ? 'Pro жазылым белсенді!' : language === 'ru' ? 'Pro подписка активна!' : 'Pro subscription active!'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Preferences */}
                                <section>
                                    <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-emerald-glow" />
                                        {t('preferences')}
                                    </h3>
                                    <div className="glass-card bg-surface/30 rounded-2xl border border-white/5 overflow-hidden">
                                        <div className="p-4 border-b border-white/5">
                                            <p className="font-medium text-text-main mb-3">{t('language')}</p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleLanguageChange('kk')}
                                                    className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all text-sm ${language === 'kk'
                                                        ? 'bg-emerald-glow text-void shadow-lg shadow-emerald-500/20'
                                                        : 'bg-surface/50 text-text-muted hover:bg-surface border border-white/5'
                                                        }`}
                                                >
                                                    🇰🇿 Қазақша
                                                </button>
                                                <button
                                                    onClick={() => handleLanguageChange('ru')}
                                                    className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all text-sm ${language === 'ru'
                                                        ? 'bg-emerald-glow text-void shadow-lg shadow-emerald-500/20'
                                                        : 'bg-surface/50 text-text-muted hover:bg-surface border border-white/5'
                                                        }`}
                                                >
                                                    🇷🇺 Русский
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5">
                                            <div>
                                                <p className="font-medium text-text-main">{t('emailNotifications')}</p>
                                                <p className="text-sm text-text-dim">{t('emailNotificationsDesc')}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-surface/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-glow"></div>
                                            </label>
                                        </div>
                                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                                            <div>
                                                <p className="font-medium text-text-main">{t('saveChatHistory')}</p>
                                                <p className="text-sm text-text-dim">{t('saveChatHistoryDesc')}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-surface/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-glow"></div>
                                            </label>
                                        </div>
                                    </div>
                                </section>

                                {/* Privacy & Security */}
                                <section>
                                    <h3 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-emerald-glow" />
                                        {t('privacy')}
                                    </h3>
                                    <div className="glass-card bg-surface/30 rounded-2xl border border-white/5 overflow-hidden">
                                        <button className="w-full text-left p-4 hover:bg-white/5 transition-colors border-b border-white/5">
                                            <p className="font-medium text-text-main">{t('changePassword')}</p>
                                            <p className="text-sm text-text-dim">{t('changePasswordDesc')}</p>
                                        </button>
                                        <button className="w-full text-left p-4 hover:bg-white/5 transition-colors border-b border-white/5">
                                            <p className="font-medium text-text-main">{t('twoFactor')}</p>
                                            <p className="text-sm text-text-dim">{t('twoFactorDesc')}</p>
                                        </button>
                                        <button className="w-full text-left p-4 hover:bg-red-500/10 transition-colors group">
                                            <p className="font-medium text-red-400 group-hover:text-red-300">{t('deleteAllChats')}</p>
                                            <p className="text-sm text-text-dim">{t('deleteAllChatsDesc')}</p>
                                        </button>
                                    </div>
                                </section>
                            </div>

                            {/* Danger Zone */}
                            <section className="pt-8">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 p-4 bg-surface/30 border-2 border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-semibold"
                                >
                                    <LogOut className="w-5 h-5" />
                                    {t('signOut')}
                                </button>
                                <p className="text-center text-xs text-text-dim/50 mt-4">
                                    {t('footer')}
                                </p>
                            </section>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
