import { Plus, MessageSquare, Settings, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onOpenSettings: () => void;
}

const Sidebar = ({ isOpen, setIsOpen, onOpenSettings }: SidebarProps) => {
    const { user } = useAuth();

    return (
        <aside
            className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-bg-light dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
        >
            <div className="flex flex-col h-full">
                {/* Header / New Chat */}
                <div className="p-4">
                    <button className="flex items-center gap-2 w-full px-4 py-3 bg-hero-1 text-white rounded-xl hover:bg-hero-1/90 transition-colors shadow-lg shadow-hero-1/20 group">
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        <span className="font-semibold">New Chat</span>
                    </button>

                    <div className="mt-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hero-1/50 dark:text-gray-200"
                        />
                    </div>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto px-2 space-y-6 py-2">
                    {/* Today */}
                    <div>
                        <h3 className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                            Today
                        </h3>
                        <div className="space-y-1">
                            {['Kazakh History: 19th Century', 'Math: Probability Basics', 'Geography: Climate Zones'].map((chat, i) => (
                                <button key={i} className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-text-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg group transition-colors">
                                    <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-hero-1" />
                                    <span className="truncate">{chat}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Yesterday */}
                    <div>
                        <h3 className="px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                            Yesterday
                        </h3>
                        <div className="space-y-1">
                            {['Biology: Cell Structure', 'Physics: Newton Laws'].map((chat, i) => (
                                <button key={i} className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-text-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg group transition-colors">
                                    <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-hero-1" />
                                    <span className="truncate">{chat}</span>
                                </button>
                            ))}
                        </div>
                    </div>
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

