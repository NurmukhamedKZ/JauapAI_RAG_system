import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HowItWorks = () => {
    const { t } = useLanguage();
    const icons = [MessageCircle, CheckCircle, TrendingUp];

    return (
        <section className="py-24 bg-bg-light relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl lg:text-5xl font-bold text-text-dark mb-4"
                    >
                        {t('howItWorks.title')} <span className="text-cta">{t('howItWorks.title_accent')}</span>
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { title: 'howItWorks.step1.title', desc: 'howItWorks.step1.desc', iconIdx: 0 },
                        { title: 'howItWorks.step2.title', desc: 'howItWorks.step2.desc', iconIdx: 1 },
                        { title: 'howItWorks.step3.title', desc: 'howItWorks.step3.desc', iconIdx: 2 }
                    ].map((step, idx) => {
                        const Icon = icons[step.iconIdx];
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="relative flex flex-col items-center text-center p-8 bg-surface rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                            >
                                {/* Step Number Badge */}
                                <div className="absolute -top-4 -left-4 w-10 h-10 bg-cta text-white font-bold rounded-full flex items-center justify-center text-lg shadow-md">
                                    {idx + 1}
                                </div>

                                <div className="w-20 h-20 bg-hero-1/10 rounded-full flex items-center justify-center mb-6 text-cta">
                                    <Icon className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-text-dark mb-3">{t(step.title)}</h3>
                                <p className="text-muted leading-relaxed">
                                    {t(step.desc)}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
