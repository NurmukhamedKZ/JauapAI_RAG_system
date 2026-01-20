import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Send, Bot, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { conversationService } from '../../services/conversationService';
import type { ChatFilters } from '../../services/conversationService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
            // Clear the state so it doesn't re-trigger on refresh
            window.history.replaceState({}, document.title);
            // Send the message immediately
            handleSend(initialMessage);
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

    const handleSend = async (manualMessage?: string) => {
        const messageToSend = manualMessage || input;

        if (!messageToSend.trim() || isLoading) return;

        // Check if user is authenticated
        if (!isAuthenticated) {
            // Check if guest has already used their free message
            const hasUsedGuest = localStorage.getItem('jauap_guest_used');

            if (hasUsedGuest) {
                setShowAuthModal(true);
                return;
            }

            // Guest Flow
            const userMessage = messageToSend;
            setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
            if (!manualMessage) setInput('');
            setIsLoading(true);

            // Add placeholder for AI response
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            try {
                await conversationService.sendGuestMessage(
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

                // Mark guest usage as completed
                localStorage.setItem('jauap_guest_used', 'true');

                // Optional: You could show a message here or prompt registration after the answer
                // For now, next attempt will trigger auth modal

            } catch (error) {
                console.error('Error sending guest message:', error);
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastIndex = newMessages.length - 1;
                    newMessages[lastIndex] = {
                        role: 'assistant',
                        content: 'Кешіріңіз, қате пайда болды. Қайталап көріңіз.',
                    };
                    return newMessages;
                });
            } finally {
                setIsLoading(false);
            }
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
        const userMessage = messageToSend;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        if (!manualMessage) setInput('');
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
        <div className="flex flex-col h-full bg-void transition-colors duration-300">
            {/* Messages Area - Centered */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
                            <div className="w-20 h-20 bg-emerald-glow/10 border border-emerald-glow/20 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                <Bot className="w-10 h-10 text-emerald-glow" />
                            </div>
                            <h2 className="text-3xl font-bold font-heading text-text-main mb-4">
                                {language === 'kk' ? 'Сәлем! Мен JauapAI' : 'Привет! Я JauapAI'}
                            </h2>
                            <p className="text-text-muted max-w-md text-lg">
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
                                            <div className="bg-emerald-glow text-void font-medium px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] text-[15px] leading-relaxed shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                                {msg.content}
                                            </div>
                                        </div>
                                    ) : (
                                        // Assistant message - left aligned
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-deep border border-emerald-glow/20 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Bot className="w-5 h-5 text-emerald-glow" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {msg.content ? (
                                                    <div className="text-text-main text-[15px] leading-relaxed glass-card p-4 rounded-2xl rounded-tl-sm border border-white/5 bg-surface/30">
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm]}
                                                            components={{
                                                                code({ node, inline, className, children, ...props }: any) {
                                                                    const match = /language-(\w+)/.exec(className || '');
                                                                    return !inline && match ? (
                                                                        <SyntaxHighlighter
                                                                            style={oneDark}
                                                                            language={match[1]}
                                                                            PreTag="div"
                                                                            className="rounded-lg !my-4 !bg-black/50 border border-white/10"
                                                                            {...props}
                                                                        >
                                                                            {String(children).replace(/\n$/, '')}
                                                                        </SyntaxHighlighter>
                                                                    ) : (
                                                                        <code className="bg-white/10 text-emerald-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                                                            {children}
                                                                        </code>
                                                                    );
                                                                },
                                                                p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                                                ul: ({ children }) => <ul className="list-disc list-outside ml-4 mb-4 space-y-1">{children}</ul>,
                                                                ol: ({ children }) => <ol className="list-decimal list-outside ml-4 mb-4 space-y-1">{children}</ol>,
                                                                li: ({ children }) => <li className="pl-1">{children}</li>,
                                                                h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-4 mt-2 font-heading">{children}</h1>,
                                                                h2: ({ children }) => <h2 className="text-lg font-bold text-emerald-glow mb-3 mt-4 font-heading">{children}</h2>,
                                                                h3: ({ children }) => <h3 className="text-md font-semibold text-white mb-2 mt-3 font-heading">{children}</h3>,
                                                                blockquote: ({ children }) => <blockquote className="border-l-4 border-emerald-glow/50 pl-4 py-1 my-4 bg-emerald-glow/5 rounded-r italic">{children}</blockquote>,
                                                                a: ({ children, href }) => <a href={href} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
                                                                table: ({ children }) => <div className="overflow-x-auto my-4 rounded-lg border border-white/10"><table className="min-w-full divide-y divide-white/10 bg-black/20">{children}</table></div>,
                                                                th: ({ children }) => <th className="px-4 py-3 text-left text-xs font-medium text-emerald-glow uppercase tracking-wider bg-white/5">{children}</th>,
                                                                td: ({ children }) => <td className="px-4 py-3 text-sm text-text-muted whitespace-nowrap border-t border-white/5">{children}</td>,
                                                            }}
                                                        >
                                                            {msg.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                ) : isLoading && idx === messages.length - 1 ? (
                                                    <div className="flex items-center gap-2 text-text-dim text-sm ml-2">
                                                        <span>{language === 'kk' ? 'Ойланып жатыр' : 'Думает'}</span>
                                                        <span className="flex gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-glow animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-glow animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-glow animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
            <div className="p-4 pb-6 bg-void">
                <div className="max-w-3xl mx-auto">
                    {/* Input Container */}
                    <div className="bg-surface/50 backdrop-blur-md rounded-3xl p-4 shadow-lg border border-white/10 transition-colors duration-300 focus-within:border-emerald-glow/30 focus-within:ring-1 focus-within:ring-emerald-glow/30">
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
                            className="w-full bg-transparent border-none text-text-main placeholder-text-dim resize-none focus:outline-none text-base transition-colors duration-300"
                            rows={2}
                        />

                        {/* Bottom Row: Filters + Send Button */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 transition-colors duration-300">
                            {/* Filter Pills */}
                            <FilterBar filters={filters} setFilters={setFilters} />

                            {/* Send Button */}
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                className="p-2.5 bg-emerald-glow text-void rounded-full hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-4 flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)] transform hover:scale-105 active:scale-95"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-void border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-xs text-text-dim text-center mt-3">
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
                            <div className="glass-card bg-surface/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-8 relative border border-white/10">
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
