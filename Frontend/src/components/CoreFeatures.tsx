

import { motion } from 'framer-motion';
import { Zap, Shield, Globe } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';


const CoreFeatures = () => {
    const { t } = useLanguage();
    return (
        <section id="core-features" className="py-24 bg-void relative">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl lg:text-5xl font-bold font-heading text-text-main mb-4"
                    >
                        {t('core.title')} <span className="text-emerald-glow">{t('core.title_accent')}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-text-muted text-lg max-w-2xl mx-auto"
                    >
                        {t('core.subtitle')}
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">

                    {[
                        { title: 'core.item1.title', desc: 'core.item1.desc' },
                        { title: 'core.item2.title', desc: 'core.item2.desc' },
                        { title: 'core.item3.title', desc: 'core.item3.desc' }
                    ].map((item, idx) => {
                        const icons = [Zap, Shield, Globe];
                        const Icon = icons[idx];

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="text-center p-8 rounded-3xl bg-surface/30 border border-white/5 hover:bg-surface/50 hover:border-emerald-glow/20 transition-all duration-300 group"
                            >
                                <div className="w-16 h-16 mx-auto bg-emerald-deep/40 rounded-2xl flex items-center justify-center mb-6 text-emerald-glow group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10 group-hover:ring-emerald-glow/30">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-text-main mb-3">{t(item.title)}</h3>
                                <p className="text-text-muted leading-relaxed">
                                    {t(item.desc)}
                                </p>
                            </motion.div>
                        )
                    })}

                </div>
            </div>
        </section>
    );
};

export default CoreFeatures;
