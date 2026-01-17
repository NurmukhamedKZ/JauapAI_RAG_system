import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, PanelLeftClose, PanelLeft } from 'lucide-react';

interface ChatHeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const ChatHeader = ({ isSidebarOpen, setIsSidebarOpen }: ChatHeaderProps) => {
    // Theme Toggle State
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

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
            {/* Left: Sidebar Toggle + Logo */}
            <div className="flex items-center gap-3">
                {/* Sidebar Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 hover:scale-105"
                    title={isSidebarOpen ? 'Сайдбарды жабу' : 'Сайдбарды ашу'}
                >
                    <div className="transition-transform duration-300" style={{ transform: isSidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                        {isSidebarOpen ? (
                            <PanelLeftClose className="w-5 h-5" />
                        ) : (
                            <PanelLeft className="w-5 h-5" />
                        )}
                    </div>
                </button>

                {/* Logo - Clickable, redirects to landing */}
                <Link
                    to="/"
                    className="text-xl font-bold bg-gradient-to-r from-hero-1 to-hero-2 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                    JauapAI
                </Link>
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
