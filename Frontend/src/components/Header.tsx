
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
    const { t } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Nav links are now dynamic based on translations
    // We will render them directly in the JSX using t()


    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-bg-light/80 backdrop-blur-md py-3 shadow-sm'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className={`flex items-center transition-all duration-300 flex-shrink-0 z-20 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
                        <span className="text-2xl font-bold bg-gradient-to-r from-hero-1 to-hero-2 bg-clip-text text-transparent">
                            JauapAI
                        </span>
                    </div>

                    {/* Centered Desktop Nav */}
                    <nav className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center space-x-8">
                        <a href="#advantages" className="text-text-dark hover:text-accent transition-colors font-medium text-sm whitespace-nowrap">
                            {t('header.advantages')}
                        </a>
                        <a href="#features" className="text-text-dark hover:text-accent transition-colors font-medium text-sm whitespace-nowrap">
                            {t('header.features')}
                        </a>
                        <a href="#benchmarks" className="text-text-dark hover:text-accent transition-colors font-medium text-sm whitespace-nowrap">
                            {t('header.pricing')}
                        </a>
                        <a href="#about" className="text-text-dark hover:text-accent transition-colors font-medium text-sm whitespace-nowrap">
                            {t('header.about')}
                        </a>
                    </nav>

                    {/* Right Actions (Desktop) */}
                    <div className="hidden md:flex items-center gap-4 z-20">
                        <LanguageSwitcher />

                        <button className="bg-cta text-white h-11 w-[230px] rounded-full font-semibold hover:bg-cta-hover transition-all duration-200 transform hover:scale-105 shadow-lg shadow-cta/20 flex items-center justify-center">
                            {t('header.cta')}
                        </button>
                    </div>

                    {/* Mobile Actions */}
                    <div className="md:hidden flex items-center gap-4 z-20">
                        <LanguageSwitcher />
                        <button
                            className="text-text-dark"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <a href="#advantages" className="block py-2 text-text-dark hover:text-accent font-medium bg-gray-50 px-3 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>{t('header.advantages')}</a>
                            <a href="#features" className="block py-2 text-text-dark hover:text-accent font-medium bg-gray-50 px-3 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>{t('header.features')}</a>
                            <a href="#benchmarks" className="block py-2 text-text-dark hover:text-accent font-medium bg-gray-50 px-3 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>{t('header.pricing')}</a>
                            <a href="#about" className="block py-2 text-text-dark hover:text-accent font-medium bg-gray-50 px-3 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>{t('header.about')}</a>

                            <div className="pt-2">
                                <button className="w-full bg-cta text-white px-5 py-3 rounded-xl font-semibold hover:bg-cta-hover transition-colors shadow-lg shadow-cta/20">
                                    {t('header.cta')}
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
