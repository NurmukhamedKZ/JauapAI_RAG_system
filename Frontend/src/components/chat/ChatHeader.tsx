import { useState, useEffect } from 'react';
import { Sun, Moon, Zap, Brain, ChevronDown, Filter } from 'lucide-react';

interface ChatHeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const ChatHeader = ({ isSidebarOpen, setIsSidebarOpen }: ChatHeaderProps) => {
    // Theme Toggle State
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // Filters State
    const [model, setModel] = useState<'flash' | 'pro'>('flash');
    const [discipline, setDiscipline] = useState('History');
    const [grade, setGrade] = useState('11');
    const [publisher, setPublisher] = useState('Atamur');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 z-30 transition-colors duration-300">
            {/* Left: Mobile Menu & Model Selector */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                    <Filter className="w-5 h-5" />
                </button>

                {/* Model Selector */}
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setModel('flash')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${model === 'flash'
                                ? 'bg-white dark:bg-gray-700 text-hero-1 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                            }`}
                    >
                        <Zap className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Flash</span>
                    </button>
                    <button
                        onClick={() => setModel('pro')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${model === 'pro'
                                ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                            }`}
                    >
                        <Brain className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Pro</span>
                    </button>
                </div>
            </div>

            {/* Middle: Filters (Hidden on small mobile, visible on desktop/tablet) */}
            <div className="hidden md:flex items-center gap-3">
                <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="bg-transparent text-sm font-medium text-text-dark dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-hero-1/50"
                >
                    <option>History of Kazakhstan</option>
                    <option>Geography</option>
                    <option>Math Literacy</option>
                </select>

                <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="bg-transparent text-sm font-medium text-text-dark dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-hero-1/50"
                >
                    {[6, 7, 8, 9, 10, 11].map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>

                <select
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="bg-transparent text-sm font-medium text-text-dark dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-hero-1/50"
                >
                    <option>Atamur</option>
                    <option>Mektep</option>
                </select>
            </div>

            {/* Right: Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
        </header>
    );
};

export default ChatHeader;
