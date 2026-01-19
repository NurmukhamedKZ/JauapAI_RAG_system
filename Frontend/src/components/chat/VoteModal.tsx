import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Vote, Sparkles, MapPin, Calculator, Zap, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { submitVote } from '../../services/voteService';

interface VoteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const subjectIcons: Record<string, React.ReactNode> = {
    'География': <MapPin className="w-5 h-5" />,
    'Математика': <Calculator className="w-5 h-5" />,
    'Физика': <Zap className="w-5 h-5" />,
};

const subjectColors: Record<string, string> = {
    'География': 'from-emerald-500 to-teal-500',
    'Математика': 'from-blue-500 to-indigo-500',
    'Физика': 'from-orange-500 to-amber-500',
};

const VoteModal = ({ isOpen, onClose }: VoteModalProps) => {
    const { language } = useLanguage();
    const { isAuthenticated } = useAuth();
    const [isVoting, setIsVoting] = useState(false);
    const [voted, setVoted] = useState<string | null>(null);
    const [voteMessage, setVoteMessage] = useState<string | null>(null);

    const subjects = ['География', 'Математика', 'Физика'];

    const handleVote = async (subject: string) => {
        if (!isAuthenticated) {
            setVoteMessage(
                language === 'kk'
                    ? 'Дауыс беру үшін жүйеге кіріңіз'
                    : 'Войдите, чтобы проголосовать'
            );
            return;
        }

        setIsVoting(true);
        try {
            const response = await submitVote(subject);
            setVoted(subject);
            setVoteMessage(response.message);
        } catch (error) {
            setVoteMessage(
                language === 'kk'
                    ? 'Қате пайда болды. Қайталап көріңіз.'
                    : 'Произошла ошибка. Попробуйте снова.'
            );
        } finally {
            setIsVoting(false);
        }
    };

    const handleClose = () => {
        setVoted(null);
        setVoteMessage(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-gray-200 dark:border-gray-700">
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-hero-1 to-hero-2 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {language === 'kk' ? 'Жаңа пән келе жатыр!' : 'Скоро новый предмет!'}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {language === 'kk'
                                        ? 'Қай пәнді бірінші қосқанымызды білгіңіз келе ме? Дауыс беріңіз!'
                                        : 'Хотите решить, какой предмет добавим первым? Проголосуйте!'
                                    }
                                </p>
                            </div>

                            {/* Subject Buttons */}
                            <div className="space-y-3 mb-6">
                                {subjects.map((subject) => (
                                    <button
                                        key={subject}
                                        onClick={() => handleVote(subject)}
                                        disabled={isVoting || voted !== null}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${voted === subject
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-hero-1 hover:bg-hero-1/5'
                                            } ${(isVoting || voted !== null) && voted !== subject ? 'opacity-50' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subjectColors[subject]} flex items-center justify-center text-white`}>
                                                {subjectIcons[subject]}
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {subject}
                                            </span>
                                        </div>

                                        {isVoting && voted === null ? (
                                            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                        ) : voted === subject ? (
                                            <Check className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Vote className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Vote Message */}
                            {voteMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-center p-3 rounded-lg ${voted
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                        }`}
                                >
                                    {voteMessage}
                                </motion.div>
                            )}

                            {/* Footer */}
                            <p className="text-xs text-gray-400 text-center mt-4">
                                {language === 'kk'
                                    ? 'Бұл пәндер әлі қосылмаған. Сіздің дауысыңыз маңызды!'
                                    : 'Эти предметы ещё не добавлены. Ваш голос важен!'
                                }
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default VoteModal;
