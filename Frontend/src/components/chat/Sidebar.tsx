import { useState, useEffect } from 'react';
import { Plus, MessageSquare, Settings, Search, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { conversationService } from '../../services/conversationService';
import type { Conversation } from '../../services/conversationService';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onOpenSettings: () => void;
    selectedConversationId: string | null;
    onSelectConversation: (id: string | null) => void;
    onNewChat: () => void;
}

const Sidebar = ({
    isOpen,
    onOpenSettings,
    selectedConversationId,
    onSelectConversation,
    onNewChat
}: SidebarProps) => {
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Load conversations
    useEffect(() => {
        if (isAuthenticated) {
            loadConversations();
        }
    }, [isAuthenticated]);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const data = await conversationService.list();
            setConversations(data);
        } catch (error) {
            console.error('Failed to load conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await conversationService.delete(id);
            setConversations(prev => prev.filter(c => c.id !== id));
            if (selectedConversationId === id) {
                onSelectConversation(null);
            }
        } catch (error) {
            console.error('Failed to delete conversation:', error);
        }
    };

    const handleNewChat = () => {
        onNewChat();
        // Reload conversations after a short delay
        setTimeout(loadConversations, 500);
    };

    // Group conversations by date
    const groupByDate = (convs: Conversation[]) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today.getTime() - 86400000);
        const lastWeek = new Date(today.getTime() - 7 * 86400000);

        const groups: { [key: string]: Conversation[] } = {
            'today': [],
            'yesterday': [],
            'last7days': [],
            'older': [],
        };

        convs.forEach(conv => {
            const convDate = new Date(conv.created_at || new Date());
            convDate.setHours(0, 0, 0, 0);

            if (convDate >= today) {
                groups['today'].push(conv);
            } else if (convDate >= yesterday) {
                groups['yesterday'].push(conv);
            } else if (convDate >= lastWeek) {
                groups['last7days'].push(conv);
            } else {
                groups['older'].push(conv);
            }
        });

        return groups;
    };

    const filteredConversations = conversations.filter(c =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedConversations = groupByDate(filteredConversations);

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 w-72 bg-bg-light dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            <div className="flex flex-col h-full">
                {/* Header / New Chat */}
                <div className="p-4">
                    <button
                        onClick={handleNewChat}
                        className="flex items-center gap-2 w-full px-4 py-3 bg-hero-1 text-white rounded-xl hover:bg-hero-1/90 transition-colors shadow-lg shadow-hero-1/20 group"
                    >
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        <span className="font-semibold">{t('newChat')}</span>
                    </button>

                    <div className="mt-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hero-1/50 dark:text-gray-200"
                        />
                    </div>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto px-2 space-y-4 py-2">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-6 h-6 border-2 border-hero-1 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : !isAuthenticated ? (
                        <p className="px-4 text-sm text-gray-500 dark:text-gray-400">
                            {t('loginToSeeHistory')}
                        </p>
                    ) : filteredConversations.length === 0 ? (
                        <p className="px-4 text-sm text-gray-500 dark:text-gray-400">
                            {t('noChats')}
                        </p>
                    ) : (
                        Object.entries(groupedConversations).map(([group, convs]) => (
                            convs.length > 0 && (
                                <div key={group}>
                                    <h3 className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                                        {t(group)}
                                    </h3>
                                    <div className="space-y-1">
                                        {convs.map((conv) => (
                                            <button
                                                key={conv.id}
                                                onClick={() => onSelectConversation(conv.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm rounded-lg group transition-colors ${selectedConversationId === conv.id
                                                    ? 'bg-hero-1/10 text-hero-1'
                                                    : 'text-text-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                <MessageSquare className={`w-4 h-4 flex-shrink-0 ${selectedConversationId === conv.id ? 'text-hero-1' : 'text-gray-400 group-hover:text-hero-1'
                                                    }`} />
                                                <span className="truncate flex-1">{conv.title || 'New Chat'}</span>
                                                <Trash2
                                                    onClick={(e) => handleDelete(conv.id, e)}
                                                    className="w-4 h-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))
                    )}
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div
                        onClick={onOpenSettings}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-hero-1 to-hero-2 flex items-center justify-center text-white font-bold">
                            {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-dark dark:text-white truncate">
                                {user?.full_name || user?.email?.split('@')[0] || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user?.subscription_tier === 'pro' ? 'Pro Plan' : 'Free Plan'}
                            </p>
                        </div>
                        <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
