import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HowItWorks = () => {
    const { t } = useLanguage();
    const icons = [MessageCircle, CheckCircle, TrendingUp];

    return (
        <section className="py-32 bg-void relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-deep/20 rounded-full blur-[100px] opacity-30" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-glow/10 rounded-full blur-[100px] opacity-20" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl lg:text-5xl font-bold font-heading text-text-main mb-6"
                    >
                        {t('howItWorks.title')} <span className="text-emerald-glow text-glow">{t('howItWorks.title_accent')}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-text-dim text-lg max-w-2xl mx-auto"
                    >
                        {t('howItWorks.subtitle') || 'Start your journey to academic excellence in three simple steps.'}
                    </motion.p>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Animated Connection Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[100px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-emerald-900/30 via-emerald-glow to-emerald-900/30 z-0 opacity-30">
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-glow to-transparent origin-left"
                        />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
                        {[
                            { title: 'howItWorks.step1.title', desc: 'howItWorks.step1.desc', iconIdx: 0, delay: 0.2 },
                            { title: 'howItWorks.step2.title', desc: 'howItWorks.step2.desc', iconIdx: 1, delay: 0.4 },
                            { title: 'howItWorks.step3.title', desc: 'howItWorks.step3.desc', iconIdx: 2, delay: 0.6 }
                        ].map((step, idx) => {
                            const Icon = icons[step.iconIdx];
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: step.delay, duration: 0.5 }}
                                    className="relative flex flex-col items-center text-center group"
                                >
                                    {/* Icon Container with Glow */}
                                    <div className="relative mb-8 z-10 w-24 h-24 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-surface rounded-2xl rotate-45 border border-white/5 shadow-2xl group-hover:border-emerald-glow/50 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-500 bg-surface/80 backdrop-blur-xl"></div>
                                        <div className="absolute inset-2 bg-gradient-to-br from-emerald-deep/50 to-emerald-900/20 rounded-xl rotate-45 opacity-50"></div>
                                        <Icon className="w-10 h-10 text-emerald-glow relative z-10 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />

                                        {/* Step Number Badge */}
                                        <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-surface border border-emerald-glow font-bold text-emerald-glow flex items-center justify-center text-sm shadow-[0_0_10px_rgba(16,185,129,0.3)] z-20">
                                            {idx + 1}
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="relative p-8 glass-card rounded-2xl w-full hover:bg-white/5 transition-colors duration-300 border-t border-white/10 group-hover:border-t-emerald-glow/30">
                                        <h3 className="text-2xl font-bold text-text-main mb-4 group-hover:text-emerald-glow transition-colors font-heading">{t(step.title)}</h3>
                                        <p className="text-text-muted leading-relaxed">
                                            {t(step.desc)}
                                        </p>
                                    </div>

                                    {/* Mobile Vertical Connector */}
                                    {idx < 2 && (
                                        <div className="lg:hidden absolute bottom-[-48px] left-1/2 w-0.5 h-12 bg-gradient-to-b from-emerald-glow/50 to-transparent"></div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
