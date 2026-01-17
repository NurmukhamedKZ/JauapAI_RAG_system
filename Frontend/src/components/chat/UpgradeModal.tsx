import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Zap, MessageSquare, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { subscriptionService } from '../../services/subscriptionService';
import { useState } from 'react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgraded?: () => void;
}

const UpgradeModal = ({ isOpen, onClose, onUpgraded }: UpgradeModalProps) => {
    const { language } = useLanguage();
    const [isUpgrading, setIsUpgrading] = useState(false);

    const handleUpgrade = async () => {
        setIsUpgrading(true);
        try {
            // For testing, just toggle to Pro
            await subscriptionService.togglePlan();
            onUpgraded?.();
            onClose();
        } catch (error) {
            console.error('Failed to upgrade:', error);
        } finally {
            setIsUpgrading(false);
        }
    };

    const proFeatures = [
        { icon: MessageSquare, text: language === 'kk' ? '200 хабарлама/ай' : '200 сообщений/месяц' },
        { icon: Sparkles, text: 'Gemini Pro' },
        { icon: Zap, text: language === 'kk' ? 'Жылдам жауаптар' : 'Быстрые ответы' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header with gradient */}
                            <div className="bg-gradient-to-br from-hero-1 to-hero-2 p-8 text-white text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                                    <Crown className="w-48 h-48" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Crown className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">
                                        {language === 'kk' ? 'Хабарлама лимиті аяқталды!' : 'Лимит сообщений исчерпан!'}
                                    </h3>
                                    <p className="text-white/80">
                                        {language === 'kk'
                                            ? 'Pro жоспарына көтеріліп, шексіз сөйлесіңіз'
                                            : 'Перейдите на Pro план для безлимитного общения'
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="p-8">
                                <h4 className="text-lg font-semibold text-text-dark dark:text-white mb-4">
                                    {language === 'kk' ? 'Pro жоспар артықшылықтары:' : 'Преимущества Pro плана:'}
                                </h4>
                                <div className="space-y-4 mb-8">
                                    {proFeatures.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-hero-1/10 rounded-xl flex items-center justify-center">
                                                <feature.icon className="w-5 h-5 text-hero-1" />
                                            </div>
                                            <span className="text-text-dark dark:text-gray-200 font-medium">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Action buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleUpgrade}
                                        disabled={isUpgrading}
                                        className="w-full bg-gradient-to-r from-hero-1 to-hero-2 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-hero-1/30 hover:shadow-xl hover:shadow-hero-1/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Crown className="w-5 h-5" />
                                        {isUpgrading
                                            ? (language === 'kk' ? 'Жаңартылуда...' : 'Обновление...')
                                            : (language === 'kk' ? 'Pro-ға көтерілу' : 'Перейти на Pro')
                                        }
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 py-3 font-medium transition-colors"
                                    >
                                        {language === 'kk' ? 'Кейін' : 'Позже'}
                                    </button>
                                </div>

                                {/* Note */}
                                <p className="text-xs text-gray-400 text-center mt-4">
                                    ⚠️ {language === 'kk' ? 'Тестілеу режимі - жазылым тегін' : 'Тестовый режим - подписка бесплатная'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UpgradeModal;
