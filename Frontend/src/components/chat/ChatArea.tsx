import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User } from 'lucide-react';

const ChatArea = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am JauapAI. Choose a subject and grade above, and ask me anything about UNT preparation.' },
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        // Add User Message
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI Response (Mock)
        setTimeout(() => {
            const aiMsg = { role: 'ai', content: 'This is a simulated response. In the real app, this will connect to Gemini 3 Flash/Pro.' };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-bg-light dark:bg-gray-950 transition-colors duration-300">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai'
                                ? 'bg-hero-1 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}>
                            {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[80%] lg:max-w-[70%] rounded-2xl px-5 py-3.5 shadow-sm text-sm leading-relaxed ${msg.role === 'ai'
                                ? 'bg-white dark:bg-gray-900 text-text-dark dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-tl-none'
                                : 'bg-hero-1 text-white rounded-tr-none'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute left-3 bottom-3 text-gray-400 hover:text-hero-1 cursor-pointer p-1">
                        <Paperclip className="w-5 h-5" />
                    </div>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Ask a question..."
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl pl-12 pr-12 py-4 max-h-32 min-h-[56px] focus:ring-2 focus:ring-hero-1/50 resize-none dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        rows={1}
                        style={{ height: 'auto', minHeight: '56px' }}
                    />

                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="absolute right-3 bottom-2.5 p-2 bg-hero-1 text-white rounded-xl hover:bg-hero-1/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-2">
                    JauapAI can make mistakes. Please verify important information from textbooks.
                </p>
            </div>
        </div>
    );
};

export default ChatArea;
