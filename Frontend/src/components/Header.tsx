
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20); // More sensitive scroll trigger
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { key: 'header.advantages', href: '#advantages' },
        { key: 'header.features', href: '#features' },
        { key: 'header.pricing', href: '#benchmarks' },
        { key: 'header.about', href: '#about' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
                ? 'bg-void/70 backdrop-blur-xl border-white/5 py-3'
                : 'bg-transparent border-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
                        <img src="/logo.png" alt="JauapAI" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-heading font-bold text-text-main tracking-tight">
                            Jauap<span className="text-emerald-glow">AI</span>
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.key}
                                href={link.href}
                                className="text-sm font-medium text-text-muted hover:text-emerald-glow transition-colors"
                            >
                                {t(link.key)}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <LanguageSwitcher />

                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm font-medium text-text-main hover:text-emerald-glow transition-colors px-4 py-2"
                        >
                            {t('loginBtn')}
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="relative group px-5 py-2.5 rounded-lg bg-emerald-glow text-void font-bold text-sm overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                        >
                            <span className="relative z-10">{t('registerBtn')}</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-text-main p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-surface border-b border-white/5 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.key}
                                    href={link.href}
                                    className="block text-base font-medium text-text-muted hover:text-emerald-glow"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t(link.key)}
                                </a>
                            ))}
                            <div className="border-t border-white/5 pt-4 space-y-3">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="block w-full text-left text-base font-medium text-text-main hover:text-emerald-glow"
                                >
                                    {t('loginBtn')}
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="block w-full text-center bg-emerald-glow text-void font-bold py-3 rounded-lg"
                                >
                                    {t('registerBtn')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
