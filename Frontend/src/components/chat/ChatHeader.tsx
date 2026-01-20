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
        <header className="h-16 bg-void/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-6 z-30 transition-colors duration-300">
            {/* Left: Sidebar Toggle + Logo */}
            <div className="flex items-center gap-3">
                {/* Sidebar Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-text-muted hover:bg-white/5 rounded-lg transition-all duration-200 hover:scale-105 hover:text-emerald-glow"
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
                    className="text-xl font-bold font-heading text-text-main hover:opacity-80 transition-opacity"
                >
                    Jauap<span className="text-emerald-glow">AI</span>
                </Link>
            </div>

            {/* Right: Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="p-2 text-text-muted hover:bg-white/5 rounded-lg transition-colors hover:text-emerald-glow"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
        </header>
    );
};

export default ChatHeader;
