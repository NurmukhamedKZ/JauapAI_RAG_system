
import React from 'react';
import { motion, useInView } from 'framer-motion';

import { useLanguage } from '../context/LanguageContext';


const Benchmarks = () => {
    const { t } = useLanguage();
    // Use a ref for the bar chart section
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const benchmarkData = [
        { label: t('benchmarks.subjects.math'), score: 128, color: 'bg-emerald-500' },
        { label: t('benchmarks.subjects.history'), score: 125, color: 'bg-teal-400' },
        { label: t('benchmarks.subjects.reading'), score: 122, color: 'bg-emerald-300' },
        { label: t('benchmarks.subjects.informatics'), score: 118, color: 'bg-slate-500' },
    ];

    return (
        <section id="benchmarks" className="py-24 bg-void relative overflow-hidden">
            {/* Background glow for chart area */}
            <div className="absolute right-0 top-1/2 w-[500px] h-[500px] bg-emerald-deep/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                {/* Left: Text & Stats */}
                <div>
                    <h2 className="text-4xl lg:text-5xl font-bold font-heading text-text-main mb-6">
                        {t('benchmarks.title')} <span className="text-emerald-glow">{t('benchmarks.title_accent')}</span>
                    </h2>
                    <p className="text-text-muted text-lg mb-12">
                        {t('benchmarks.subtitle')}
                    </p>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="bg-surface/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <div className="text-4xl font-bold text-emerald-400 mb-1">+30</div>
                            <div className="text-sm text-text-muted font-medium">{t('benchmarks.stat_increase')}</div>
                        </div>
                        <div className="bg-surface/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <div className="text-4xl font-bold text-emerald-glow mb-1">24/7</div>
                            <div className="text-sm text-text-muted font-medium">{t('benchmarks.stat_feedback')}</div>
                        </div>
                    </div>
                </div>

                {/* Right: Charts */}
                <div ref={ref} className="glass-card p-8 rounded-3xl relative">
                    <h3 className="text-xl font-bold text-text-main mb-8">{t('benchmarks.chart_title')}</h3>
                    <div className="space-y-6">
                        {benchmarkData.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm font-medium mb-2">
                                    <span className="text-text-main">{item.label}</span>
                                    <span className="text-text-dim">{item.score} {t('benchmarks.points')}</span>
                                </div>
                                <div className="h-3 bg-surface rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={isInView ? { width: `${(item.score / 140) * 100}%` } : { width: 0 }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.2 }}
                                        className={`h-full rounded-full ${item.color} shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
                                    ></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-4 text-sm text-text-dim">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span> {t('benchmarks.legend_student')}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-slate-600"></span> {t('benchmarks.legend_average')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Benchmarks;
