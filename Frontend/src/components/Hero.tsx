
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, BrainCircuit } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();


    return (
        <div className="relative min-h-screen overflow-hidden bg-bg-light flex items-center pt-20">
            {/* Background Morphing Wave (CSS/SVG implementation for performance) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-gradient-to-br from-hero-1 via-hero-2 to-hero-3 blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-hero-3/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob"></div>
                <div className="absolute -bottom-32 left-0 w-[600px] h-[600px] bg-hero-1/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000"></div>
                {/* SVG Wave */}
                <div className="absolute bottom-0 w-full opacity-20 transform scale-y-150 origin-bottom">
                    <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path fill="#00A67A" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-dark leading-[1.1] tracking-tight">
                            {t('hero.title_start')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-hero-1 to-hero-2">{t('hero.title_end')}</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-text-dark/80 max-w-lg leading-relaxed"
                    >
                        {t('hero.subtitle')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button className="bg-cta hover:bg-cta-hover text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-cta/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                            {t('hero.cta_primary')} <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="bg-white hover:bg-gray-50 text-text-dark border border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg shadow-sm transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                            <MessageSquare className="w-5 h-5 text-cta" /> {t('hero.cta_secondary')}
                        </button>
                    </motion.div>

                    <div className="pt-4 flex items-center gap-6 text-sm font-medium text-text-dark/60">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div> {t('hero.stats_papers')}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div> {t('hero.stats_logic')}
                        </div>
                    </div>
                </div>

                {/* Right Content - Interactive Mock */}
                <motion.div
                    className="relative hidden lg:block"
                >
                    {/* Abstract Decorative elements behind */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-hero-3/40 to-transparent rounded-full filter blur-3xl transform scale-110"></div>

                    {/* Chat Interface Card */}
                    <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-2xl hover:shadow-[0_20px_50px_rgba(14,107,74,0.15)] transition-shadow duration-500">
                        {/* Chat Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-hero-1 to-hero-2 flex items-center justify-center text-white">
                                    <BrainCircuit className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-dark">{t('hero.mock_title')}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="space-y-4 mb-6">
                            <div className="flex gap-3">
                                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%] text-sm text-gray-700">
                                    {t('hero.mock_question')}
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <div className="bg-hero-1/10 text-text-dark rounded-2xl rounded-tr-none px-4 py-3 max-w-[90%] text-sm">
                                    <p className="mb-2">{t('hero.mock_answer_intro')}</p>
                                    <p className="font-medium text-hero-1">{t('hero.mock_answer_detail')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('hero.input_placeholder')}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-hero-2/50 transition-all shadow-sm"
                            />
                            <button className="absolute right-2 top-2 p-2 bg-hero-1 text-white rounded-lg hover:bg-hero-1/90 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Badges */}
                        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {t('hero.badges').map((tag: string) => (
                                <span key={tag} className="flex-shrink-0 text-xs font-medium text-hero-1 bg-hero-3/20 px-3 py-1 rounded-full border border-hero-3/30">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
