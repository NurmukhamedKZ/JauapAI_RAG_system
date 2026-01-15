
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    const options = [
        { code: 'kk', label: 'ҚАЗ' },
        { code: 'ru', label: 'РУС' },
    ];

    return (
        <div className="flex bg-bg-light/50 backdrop-blur-sm border border-gray-200 rounded-full p-1 relative">
            {/* Background Pill */}
            <motion.div
                className="absolute top-1 bottom-1 bg-white rounded-full shadow-md z-0"
                layoutId="activeLang"
                initial={false}
                animate={{
                    x: language === 'kk' ? 0 : '100%',
                }}
                style={{
                    width: '50%',
                    left: 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            {options.map((opt) => (
                <button
                    key={opt.code}
                    onClick={() => setLanguage(opt.code as any)}
                    className={`relative z-10 px-3 py-1.5 text-xs font-bold transition-colors duration-200 w-12 text-center ${language === opt.code ? 'text-hero-1' : 'text-muted hover:text-text-dark'
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
