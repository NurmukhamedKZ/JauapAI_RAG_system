

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

const CTASection = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    return (
        <section className="py-24 bg-bg-light relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-hero-3/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-hero-1 to-hero-2 rounded-[2.5rem] p-12 lg:p-20 text-center overflow-hidden relative shadow-2xl shadow-hero-1/20"
                >
                    {/* Abstract waves on the card */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 50 Q 25 25 50 50 T 100 50 L 100 100 L 0 100 Z" fill="white" />
                        </svg>
                    </div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                            {t('cta.title')}
                        </h2>
                        <p className="text-white/80 text-lg lg:text-xl mb-10 leading-relaxed">
                            {t('cta.subtitle')}
                        </p>

                        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => { e.preventDefault(); navigate('/register'); }}>
                            <input
                                type="email"
                                placeholder={t('cta.placeholder')}
                                className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all"
                            />
                            <button className="px-8 py-4 bg-white text-hero-1 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105 flex items-center justify-center gap-2">
                                {t('cta.button')} <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>

                        <p className="mt-6 text-sm text-white/50">
                            {t('cta.disclaimer')}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
