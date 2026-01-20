

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CTASection = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    return (
        <section className="py-32 bg-void relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-[3rem] p-12 lg:p-24 text-center overflow-hidden border border-white/10 bg-surface/30 backdrop-blur-md"
                >
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-glow/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-deep/50 border border-emerald-glow/30 mb-8">
                            <Sparkles className="w-4 h-4 text-emerald-glow" />
                            <span className="text-sm font-medium text-emerald-100">Limited Time Offer</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold font-heading text-text-main mb-8 leading-tight">
                            {t('cta.title')}
                        </h2>
                        <p className="text-text-muted text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
                            {t('cta.subtitle')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <form className="w-full max-w-md flex flex-col sm:flex-row gap-3" onSubmit={(e) => { e.preventDefault(); navigate('/register'); }}>
                                <input
                                    type="email"
                                    placeholder={t('cta.placeholder')}
                                    className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-text-main placeholder-text-dim focus:outline-none focus:ring-2 focus:ring-emerald-glow/50 backdrop-blur-sm transition-all"
                                />
                                <button className="px-8 py-4 bg-emerald-glow text-void font-bold rounded-xl hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap">
                                    {t('cta.button')} <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        </div>

                        <p className="mt-8 text-sm text-text-dim">
                            {t('cta.disclaimer')}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
