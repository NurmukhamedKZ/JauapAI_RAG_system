import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Send, Bot, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { conversationService } from '../../services/conversationService';
import type { ChatFilters } from '../../services/conversationService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import FilterBar from './FilterBar';
import UpgradeModal from './UpgradeModal';

interface ChatAreaProps {
    conversationId: string | null;
    onConversationCreated: (id: string) => void;
}

const ChatArea = ({ conversationId, onConversationCreated }: ChatAreaProps) => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { t, language } = useLanguage();

    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [filters, setFilters] = useState<ChatFilters>({
        model: 'gemini-1.5-flash',
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initialMessageProcessed = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load conversation messages
    useEffect(() => {
        if (conversationId && isAuthenticated) {
            loadConversation();
        } else if (!conversationId) {
            setMessages([]);
        }
    }, [conversationId, isAuthenticated]);

    // Handle initial message from Hero demo
    useEffect(() => {
        const initialMessage = (location.state as any)?.initialMessage;
        if (initialMessage && !initialMessageProcessed.current) {
            initialMessageProcessed.current = true;
            setInput(initialMessage);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const loadConversation = async () => {
        if (!conversationId) return;
        try {
            const conv = await conversationService.get(conversationId);
            setMessages(conv.messages.map(m => ({
                role: m.role,
                content: m.content
            })));
        } catch (error) {
            console.error('Failed to load conversation:', error);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        // Check if user is authenticated
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }

        let currentConversationId = conversationId;

        // Create new conversation if needed
        if (!currentConversationId) {
            try {
                const newConv = await conversationService.create();
                currentConversationId = newConv.id;
                onConversationCreated(newConv.id);
            } catch (error) {
                console.error('Failed to create conversation:', error);
                return;
            }
        }

        // Add user message to UI
        const userMessage = input;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsLoading(true);

        // Add placeholder for AI response
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        try {
            // Stream response
            await conversationService.sendMessage(
                currentConversationId,
                userMessage,
                filters,
                (chunk) => {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastIndex = newMessages.length - 1;
                        newMessages[lastIndex] = {
                            role: 'assistant',
                            content: newMessages[lastIndex].content + chunk,
                        };
                        return newMessages;
                    });
                }
            );

            // Reload conversation after streaming to sync with backend-saved message
            // This ensures the message persists even if there are state issues
            if (currentConversationId) {
                await loadConversation();
            }
        } catch (error: any) {
            console.error('Error sending message:', error);

            // Check if it's a 429 (rate limit) error
            if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('limit')) {
                // Remove the placeholder message
                setMessages(prev => prev.slice(0, -1));
                setShowUpgradeModal(true);
            } else {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastIndex = newMessages.length - 1;
                    newMessages[lastIndex] = {
                        role: 'assistant',
                        content: 'Кешіріңіз, қате пайда болды. Қайталап көріңіз.',
                    };
                    return newMessages;
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg-light dark:bg-gray-950 transition-colors duration-300">
            {/* Messages Area - Centered */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
                            <div className="w-16 h-16 bg-hero-1/20 rounded-full flex items-center justify-center mb-6">
                                <Bot className="w-8 h-8 text-hero-1" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                {language === 'kk' ? 'Сәлем! Мен JauapAI' : 'Привет! Я JauapAI'}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                {language === 'kk'
                                    ? 'ЕНТ дайындығына көмектесемін. Сұрағыңызды қойыңыз!'
                                    : 'Помогу с подготовкой к ЕНТ. Задайте ваш вопрос!'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {messages.map((msg, idx) => (
                                <div key={idx} className="group">
                                    {msg.role === 'user' ? (
                                        // User message - right aligned bubble
                                        <div className="flex justify-end">
                                            <div className="bg-hero-1 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] text-[15px] leading-relaxed shadow-lg shadow-hero-1/20">
                                                {msg.content}
                                            </div>
                                        </div>
                                    ) : (
                                        // Assistant message - left aligned
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-hero-1 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Bot className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {msg.content ? (
                                                    <div className="text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap">
                                                        {msg.content}
                                                    </div>
                                                ) : isLoading && idx === messages.length - 1 ? (
                                                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                                                        <span>{language === 'kk' ? 'Ойланып жатыр' : 'Думает'}</span>
                                                        <span className="flex gap-0.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area with Filters */}
            <div className="p-4 pb-6">
                <div className="max-w-3xl mx-auto">
                    {/* Input Container */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        {/* Input */}
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder={language === 'kk' ? 'Сұрақ қойыңыз' : 'Задайте вопрос'}
                            className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none text-base transition-colors duration-300"
                            rows={2}
                        />

                        {/* Bottom Row: Filters + Send Button */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
                            {/* Filter Pills */}
                            <FilterBar filters={filters} setFilters={setFilters} />

                            {/* Send Button */}
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="p-2.5 bg-hero-1 text-white rounded-full hover:bg-hero-1/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-4 flex-shrink-0 shadow-lg shadow-hero-1/30"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-xs text-gray-500 text-center mt-3">
                        {language === 'kk'
                            ? 'JauapAI қате жіберуі мүмкін. Маңызды ақпаратты тексеріңіз.'
                            : 'JauapAI может допускать ошибки. Проверяйте важную информацию.'
                        }
                    </p>
                </div>
            </div>

            {/* Auth Modal */}
            <AnimatePresence>
                {showAuthModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            onClick={() => setShowAuthModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        >
                            <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-gray-700">
                                <button
                                    onClick={() => setShowAuthModal(false)}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-hero-1 to-hero-2 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Bot className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {t('registerTitle')}
                                    </h3>
                                    <p className="text-gray-400 mb-8">
                                        {t('registerDesc')}
                                    </p>
                                    <div className="space-y-3">
                                        <Link
                                            to="/register"
                                            className="block w-full bg-hero-1 hover:bg-hero-1/90 text-white py-3 px-6 rounded-xl font-bold transition-all shadow-lg shadow-hero-1/30"
                                        >
                                            {t('registerBtn')}
                                        </Link>
                                        <Link
                                            to="/login"
                                            className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-bold"
                                        >
                                            {t('loginBtn')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                onUpgraded={() => {
                    // Optionally refresh user data after upgrade
                }}
            />
        </div>
    );
};

export default ChatArea;
