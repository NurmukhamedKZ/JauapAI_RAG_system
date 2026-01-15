

import { motion } from 'framer-motion';
import { Target, Clock, TrendingUp, Lightbulb } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

const FeatureCards = () => {
    const { t } = useLanguage();

    const features = [
        {
            icon: Target,
            title: t('features.personalized.title'),
            description: t('features.personalized.desc'),
            delay: 0.1,
        },
        {
            icon: Clock,
            title: t('features.tests.title'),
            description: t('features.tests.desc'),
            delay: 0.2,
        },
        {
            icon: TrendingUp,
            title: t('features.tracking.title'),
            description: t('features.tracking.desc'),
            delay: 0.3,
        },
        {
            icon: Lightbulb,
            title: t('features.expert.title'),
            description: t('features.expert.desc'),
            delay: 0.4,
        },
    ];

    return (
        <section id="advantages" className="py-20 bg-bg-light relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: feature.delay }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="bg-surface p-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-hero-1/10 transition-shadow border border-gray-100 group"
                        >
                            <div className="w-12 h-12 bg-bg-light rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="w-6 h-6 text-cta group-hover:text-hero-1 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-text-dark mb-2">{feature.title}</h3>
                            <p className="text-muted leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureCards;
