
import React from 'react';
import { motion, useInView } from 'framer-motion';

import { useLanguage } from '../context/LanguageContext';

const Benchmarks = () => {
    const { t } = useLanguage();
    // Use a ref for the bar chart section
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const benchmarkData = [
        { label: t('benchmarks.subjects.math'), score: 98, color: 'bg-hero-1' },
        { label: t('benchmarks.subjects.history'), score: 95, color: 'bg-hero-2' },
        { label: t('benchmarks.subjects.reading'), score: 92, color: 'bg-cta' },
        { label: t('benchmarks.subjects.biology'), score: 88, color: 'bg-muted' },
    ];

    return (
        <section id="benchmarks" className="py-24 bg-bg-light">
            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
                {/* Left: Text & Stats */}
                <div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-text-dark mb-6">
                        {t('benchmarks.title')} <span className="text-cta">{t('benchmarks.title_accent')}</span>
                    </h2>
                    <p className="text-muted text-lg mb-12">
                        {t('benchmarks.subtitle')}
                    </p>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-4xl font-bold text-hero-1 mb-1">+30%</div>
                            <div className="text-sm text-text-dark/70 font-medium">{t('benchmarks.stat_increase')}</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-4xl font-bold text-cta mb-1">24/7</div>
                            <div className="text-sm text-text-dark/70 font-medium">{t('benchmarks.stat_feedback')}</div>
                        </div>
                    </div>
                </div>

                {/* Right: Charts */}
                <div ref={ref} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <h3 className="text-xl font-bold text-text-dark mb-8">{t('benchmarks.chart_title')}</h3>
                    <div className="space-y-6">
                        {benchmarkData.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm font-medium mb-2">
                                    <span className="text-text-dark">{item.label}</span>
                                    <span className="text-muted">{item.score}%</span>
                                </div>
                                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={isInView ? { width: `${item.score}%` } : { width: 0 }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.2 }}
                                        className={`h-full rounded-full ${item.color}`}
                                    ></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-muted">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-hero-1"></span> {t('benchmarks.legend_student')}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-gray-200"></span> {t('benchmarks.legend_average')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Benchmarks;
