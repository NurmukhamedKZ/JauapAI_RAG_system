

import { motion } from 'framer-motion';
import { Target, Clock, TrendingUp, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FeatureCards = () => {
    const { t } = useLanguage();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section id="features" className="py-24 bg-void relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-deep/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold font-heading text-text-main mb-6"
                    >
                        {t('core.title')} <span className="text-emerald-glow">{t('core.title_accent')}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-text-muted"
                    >
                        {t('core.subtitle')}
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]"
                >
                    {/* Large Card 1 */}
                    <motion.div variants={item} className="glass-card rounded-3xl p-8 md:col-span-2 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Target className="w-32 h-32 text-emerald-glow" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-emerald-deep/50 flex items-center justify-center mb-6 border border-white/5">
                                <Target className="w-6 h-6 text-emerald-glow" />
                            </div>
                            <h3 className="text-2xl font-bold text-text-main mb-3">{t('features.personalized.title')}</h3>
                            <p className="text-text-muted max-w-md">{t('features.personalized.desc')}</p>
                        </div>
                    </motion.div>

                    {/* Tall Card */}
                    <motion.div variants={item} className="glass-card rounded-3xl p-8 md:row-span-2 flex flex-col justify-between group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-deep/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-deep/50 flex items-center justify-center mb-6 border border-white/5">
                                <TrendingUp className="w-6 h-6 text-emerald-glow" />
                            </div>
                            <h3 className="text-2xl font-bold text-text-main mb-3">{t('features.tracking.title')}</h3>
                            <p className="text-text-muted">{t('features.tracking.desc')}</p>
                        </div>
                        <div className="mt-8 relative">
                            {/* Abstract Chart visualization */}
                            <div className="flex items-end gap-2 h-24 pb-2 border-b border-white/10">
                                <div className="w-1/4 bg-emerald-500/20 h-[40%] rounded-t-sm"></div>
                                <div className="w-1/4 bg-emerald-500/40 h-[60%] rounded-t-sm"></div>
                                <div className="w-1/4 bg-emerald-500/60 h-[50%] rounded-t-sm"></div>
                                <div className="w-1/4 bg-emerald-glow h-[80%] rounded-t-sm shadow-[0_0_15px_#10b981]"></div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Standard Card */}
                    <motion.div variants={item} className="glass-card rounded-3xl p-8 group hover:border-emerald-glow/30 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-emerald-deep/50 flex items-center justify-center mb-6 border border-white/5">
                            <Clock className="w-6 h-6 text-emerald-glow" />
                        </div>
                        <h3 className="text-xl font-bold text-text-main mb-2">{t('features.tests.title')}</h3>
                        <p className="text-sm text-text-muted">{t('features.tests.desc')}</p>
                    </motion.div>

                    {/* Standard Card */}
                    <motion.div variants={item} className="glass-card rounded-3xl p-8 group hover:border-emerald-glow/30 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-emerald-deep/50 flex items-center justify-center mb-6 border border-white/5">
                            <Lightbulb className="w-6 h-6 text-emerald-glow" />
                        </div>
                        <h3 className="text-xl font-bold text-text-main mb-2">{t('features.expert.title')}</h3>
                        <p className="text-sm text-text-muted">{t('features.expert.desc')}</p>
                    </motion.div>

                    {/* Wide Card */}
                    <motion.div variants={item} className="glass-card rounded-3xl p-8 md:col-span-2 md:col-start-1 flex items-center justify-between gap-6 group">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-text-main mb-2 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-glow" />
                                {t('verified.title')}
                            </h3>
                            <p className="text-sm text-text-muted">{t('verified.desc')}</p>
                        </div>
                        <div className="hidden sm:flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full bg-surface border-2 border-void flex items-center justify-center text-xs text-emerald-glow font-bold">
                                    Book
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
};

export default FeatureCards;
