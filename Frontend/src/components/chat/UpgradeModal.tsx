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
                        <div className="glass-card bg-surface/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative border border-white/10">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-text-dim hover:text-white z-10 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header with gradient */}
                            <div className="bg-gradient-to-br from-emerald-deep to-emerald-900/50 p-8 text-white text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                                    <Crown className="w-48 h-48" />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                        <Crown className="w-8 h-8 text-emerald-glow" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 font-heading">
                                        {language === 'kk' ? 'Хабарлама лимиті аяқталды!' : 'Лимит сообщений исчерпан!'}
                                    </h3>
                                    <p className="text-white/70 text-sm">
                                        {language === 'kk'
                                            ? 'Pro жоспарына көтеріліп, шексіз сөйлесіңіз'
                                            : 'Перейдите на Pro план для безлимитного общения'
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="p-8">
                                <h4 className="text-lg font-bold text-text-main mb-4 font-heading">
                                    {language === 'kk' ? 'Pro жоспар артықшылықтары:' : 'Преимущества Pro плана:'}
                                </h4>
                                <div className="space-y-4 mb-8">
                                    {proFeatures.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 bg-emerald-glow/10 rounded-xl flex items-center justify-center border border-emerald-glow/20 group-hover:bg-emerald-glow/20 transition-colors">
                                                <feature.icon className="w-5 h-5 text-emerald-glow" />
                                            </div>
                                            <span className="text-text-main font-medium">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Action buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleUpgrade}
                                        disabled={isUpgrading}
                                        className="w-full bg-emerald-glow text-void py-4 px-6 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <Crown className="w-5 h-5" />
                                        {isUpgrading
                                            ? (language === 'kk' ? 'Жаңартылуда...' : 'Обновление...')
                                            : (language === 'kk' ? 'Pro-ға көтерілу' : 'Перейти на Pro')
                                        }
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-full text-text-dim hover:text-white py-3 font-medium transition-colors"
                                    >
                                        {language === 'kk' ? 'Кейін' : 'Позже'}
                                    </button>
                                </div>

                                {/* Note */}
                                <p className="text-xs text-text-muted/50 text-center mt-4">
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
