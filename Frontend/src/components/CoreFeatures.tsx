

import { motion } from 'framer-motion';
import { Zap, Shield, Globe } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

const CoreFeatures = () => {
    const { t } = useLanguage();
    return (
        <section id="features" className="py-24 bg-white relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl lg:text-5xl font-bold text-text-dark mb-4"
                    >
                        {t('core.title')} <span className="text-accent">{t('core.title_accent')}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted text-lg max-w-2xl mx-auto"
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
                                className="text-center p-6 rounded-3xl hover:bg-bg-light transition-colors duration-300"
                            >
                                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-hero-1/10 to-hero-2/20 rounded-2xl flex items-center justify-center mb-6 text-hero-1">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-text-dark mb-3">{t(item.title)}</h3>
                                <p className="text-muted leading-relaxed">
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
