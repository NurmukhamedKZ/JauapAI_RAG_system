import { X, User, Bell, Shield, LogOut, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        onClose();
    };

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
                            <h2 className="text-xl font-bold text-text-dark dark:text-white">Settings</h2>
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
                                    Profile
                                </h3>
                                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-6 shadow-sm">
                                    {/* Avatar & Name */}
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-hero-1 to-hero-2 flex items-center justify-center text-white text-4xl font-bold shrink-0 shadow-lg shadow-hero-1/20">
                                            {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-2xl font-bold text-text-dark dark:text-white truncate">
                                                {user?.full_name || user?.email?.split('@')[0] || 'User'}
                                            </h4>
                                            <p className="text-base text-gray-500 dark:text-gray-400 truncate mt-1">
                                                {user?.email || 'No email'}
                                            </p>
                                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300">
                                                <Crown className="w-3.5 h-3.5 text-hero-1" />
                                                {user?.subscription_tier === 'pro' ? 'Pro Plan' : 'Free Plan'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Info Grid */}
                                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                                            <p className="font-medium text-text-dark dark:text-white truncate">
                                                {user?.email || 'Not set'}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                                            <p className="font-medium text-text-dark dark:text-white truncate">
                                                {user?.full_name || 'Not set'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Subscription Section */}
                            <section>
                                <h3 className="text-lg font-semibold text-text-dark dark:text-white mb-4 flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-hero-1" />
                                    Subscription
                                </h3>
                                <div className="bg-gradient-to-br from-hero-1 to-hero-2 rounded-2xl p-8 text-white shadow-xl shadow-hero-1/20 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700">
                                        <Crown className="w-64 h-64" />
                                    </div>

                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <h4 className="text-3xl font-bold mb-2">Pro Plan</h4>
                                            <p className="text-white/90 text-lg">Unlimited messages & advanced features</p>

                                            <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
                                                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                                    Unlimited Messages
                                                </div>
                                                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                                    GPT-4 Access
                                                </div>
                                                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                                    Priority Support
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 min-w-[200px]">
                                            <div className="flex justify-between items-center bg-black/10 rounded-lg p-3">
                                                <span className="text-sm opacity-90">Next Billing</span>
                                                <span className="font-semibold">Feb 16</span>
                                            </div>
                                            <button className="w-full bg-white text-hero-1 hover:bg-gray-50 rounded-xl py-3 text-sm font-bold transition-colors shadow-lg">
                                                Manage Subscription
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
                                        Preferences
                                    </h3>
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                                        <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800">
                                            <div>
                                                <p className="font-medium text-text-dark dark:text-white">Email Notifications</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-hero-1"></div>
                                            </label>
                                        </div>
                                        <div className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                                            <div>
                                                <p className="font-medium text-text-dark dark:text-white">Save Chat History</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Keep your conversations</p>
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
                                        Privacy & Security
                                    </h3>
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                                        <button className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800">
                                            <p className="font-medium text-text-dark dark:text-white">Change Password</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Update your password</p>
                                        </button>
                                        <button className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800">
                                            <p className="font-medium text-text-dark dark:text-white">Two-Factor Authentication</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                                        </button>
                                        <button className="w-full text-left p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group">
                                            <p className="font-medium text-red-600 group-hover:text-red-700">Delete All Chats</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Clear your conversation history</p>
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
                                    Sign Out
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Trusted by students across Kazakhstan • JauapAI v1.0.0
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
