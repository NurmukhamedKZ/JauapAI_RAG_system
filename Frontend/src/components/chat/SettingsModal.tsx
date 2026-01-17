import { X, User, Bell, Shield, LogOut, Crown, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { subscriptionService } from '../../services/subscriptionService';
import type { SubscriptionStatus } from '../../services/subscriptionService';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Language = 'kk' | 'ru';

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();
    const { language, setLanguage, t } = useLanguage();
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadSubscriptionStatus();
        }
    }, [isOpen]);

    const loadSubscriptionStatus = async () => {
        try {
            const status = await subscriptionService.getStatus();
            setSubscriptionStatus(status);
        } catch (error) {
            console.error('Failed to load subscription status:', error);
        }
    };

    const handleTogglePlan = async () => {
        setIsToggling(true);
        try {
            const result = await subscriptionService.togglePlan();
            await loadSubscriptionStatus();
            await refreshUser?.();
            alert(result.message);
        } catch (error) {
            console.error('Failed to toggle plan:', error);
            alert('Failed to toggle plan');
        } finally {
            setIsToggling(false);
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
                    className="fixed inset-0 z-50 bg-bg-light dark:bg-gray-950 flex flex-col"
                >
                    {/* Header */}
                    <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-xl sticky top-0 z-10">
                        <div className="max-w-4xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-text-dark dark:text-white">{t('settings')}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8 pb-20">

                            {/* Profile Section */}
                            <section>
                                <h3 className="text-lg font-semibold text-text-dark dark:text-white mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-hero-1" />
                                    {t('profile')}
                                </h3>
                                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-6 shadow-sm">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-hero-1 to-hero-2 flex items-center justify-center text-white text-4xl font-bold shrink-0 shadow-lg shadow-hero-1/20">
                                            {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-2xl font-bold text-text-dark dark:text-white truncate">
                                                {user?.full_name || user?.email?.split('@')[0] || 'User'}
                                            </h4>
                                            <p className="text-base text-gray-500 dark:text-gray-400 truncate mt-1">
                                                {user?.email || t('notSet')}
                                            </p>
                                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300">
                                                <Crown className="w-3.5 h-3.5 text-hero-1" />
                                                {isPro ? t('proPlan') : t('freePlan')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('email')}</p>
                                            <p className="font-medium text-text-dark dark:text-white truncate">
                                                {user?.email || t('notSet')}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('fullName')}</p>
                                            <p className="font-medium text-text-dark dark:text-white truncate">
                                                {user?.full_name || t('notSet')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Subscription Section */}
                            <section>
                                <h3 className="text-lg font-semibold text-text-dark dark:text-white mb-4 flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-hero-1" />
                                    {t('subscription')}
                                </h3>
                                <div className={`rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group ${isPro ? 'bg-gradient-to-br from-hero-1 to-hero-2 shadow-hero-1/20' : 'bg-gradient-to-br from-gray-600 to-gray-800 shadow-gray-500/20'}`}>
                                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700">
                                        <Crown className="w-64 h-64" />
                                    </div>

                                    <div className="relative z-10 space-y-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div>
                                                <h4 className="text-3xl font-bold mb-2">{isPro ? t('proPlan') : t('freePlan')}</h4>
                                                <p className="text-white/90 text-lg">{isPro ? t('advancedFeatures') : '5 messages per month'}</p>
                                            </div>
                                        </div>

                                        {/* Usage Progress Bar */}
                                        {subscriptionStatus && (
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="flex items-center gap-2">
                                                        <Zap className="w-4 h-4" />
                                                        Messages Used
                                                    </span>
                                                    <span className="font-semibold">
                                                        {subscriptionStatus.message_count} / {subscriptionStatus.message_limit}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-black/20 rounded-full h-3">
                                                    <div
                                                        className={`h-3 rounded-full transition-all duration-500 ${usagePercent >= 80 ? 'bg-red-400' : 'bg-white'}`}
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
                                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                                {isPro ? '200 messages/month' : '5 messages/month'}
                                            </div>
                                            {isPro && (
                                                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                                    {t('geminiAccess')}
                                                </div>
                                            )}
                                        </div>

                                        {/* Toggle Button for Testing */}
                                        <div className="pt-4 border-t border-white/20">
                                            <p className="text-xs text-white/60 mb-3">⚠️ Testing Only - Toggle Plan</p>
                                            <button
                                                onClick={handleTogglePlan}
                                                disabled={isToggling}
                                                className="flex items-center justify-center gap-2 w-full md:w-auto bg-white text-gray-800 hover:bg-gray-100 rounded-xl py-3 px-6 text-sm font-bold transition-colors shadow-lg disabled:opacity-50"
                                            >
                                                <RefreshCw className={`w-4 h-4 ${isToggling ? 'animate-spin' : ''}`} />
                                                {isToggling ? 'Switching...' : `Switch to ${isPro ? 'Free' : 'Pro'} Plan`}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Preferences */}
                                <section>
                                    <h3 className="text-lg font-semibold text-text-dark dark:text-white mb-4 flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-hero-1" />
                                        {t('preferences')}
                                    </h3>
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                                            <p className="font-medium text-text-dark dark:text-white mb-3">{t('language')}</p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleLanguageChange('kk')}
                                                    className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all text-sm ${language === 'kk'
                                                        ? 'bg-hero-1 text-white shadow-lg shadow-hero-1/20'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    🇰🇿 Қазақша
                                                </button>
                                                <button
                                                    onClick={() => handleLanguageChange('ru')}
                                                    className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all text-sm ${language === 'ru'
                                                        ? 'bg-hero-1 text-white shadow-lg shadow-hero-1/20'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    🇷🇺 Русский
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800">
                                            <div>
                                                <p className="font-medium text-text-dark dark:text-white">{t('emailNotifications')}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('emailNotificationsDesc')}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hero-1"></div>
                                            </label>
                                        </div>
                                        <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                                            <div>
                                                <p className="font-medium text-text-dark dark:text-white">{t('saveChatHistory')}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('saveChatHistoryDesc')}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hero-1"></div>
                                            </label>
                                        </div>
                                    </div>
                                </section>

                                {/* Privacy & Security */}
                                <section>
                                    <h3 className="text-lg font-semibold text-text-dark dark:text-white mb-4 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-hero-1" />
                                        {t('privacy')}
                                    </h3>
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                                        <button className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800">
                                            <p className="font-medium text-text-dark dark:text-white">{t('changePassword')}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('changePasswordDesc')}</p>
                                        </button>
                                        <button className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800">
                                            <p className="font-medium text-text-dark dark:text-white">{t('twoFactor')}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('twoFactorDesc')}</p>
                                        </button>
                                        <button className="w-full text-left p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group">
                                            <p className="font-medium text-red-600 group-hover:text-red-700">{t('deleteAllChats')}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('deleteAllChatsDesc')}</p>
                                        </button>
                                    </div>
                                </section>
                            </div>

                            {/* Danger Zone */}
                            <section className="pt-8">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-900 border-2 border-red-100 dark:border-red-900/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all font-semibold"
                                >
                                    <LogOut className="w-5 h-5" />
                                    {t('signOut')}
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-4">
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
