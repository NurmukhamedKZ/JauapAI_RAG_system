
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, Sparkles, BrainCircuit, Command } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [demoInput, setDemoInput] = useState('');

    const handleDemoSubmit = () => {
        if (!demoInput.trim()) return;
        navigate('/chat', { state: { initialMessage: demoInput } });
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-void flex items-center pt-24 pb-12">

            {/* Background Effects - The "Void" Aesthetic */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Glowing Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-deep/40 rounded-full blur-[120px] mix-blend-screen animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-glow/5 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-16 items-center">

                {/* Left: Typography & CTA */}
                <div className="space-y-8 relative">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 text-emerald-glow text-xs font-semibold tracking-wide uppercase"
                    >
                        <Sparkles className="w-3 h-3" />
                        <span>AI-Powered 2.0</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold font-heading text-text-main leading-[1.1] tracking-tight"
                    >
                        {t('hero.title_start')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-glow to-emerald-400">
                            {t('hero.title_end')}
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-text-muted max-w-lg leading-relaxed"
                    >
                        {t('hero.subtitle')}
                    </motion.p>

                    {/* Action Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button
                            onClick={() => navigate('/chat')}
                            className="group relative px-8 py-4 bg-text-main text-void rounded-xl font-bold text-lg flex items-center justify-center gap-2 overflow-hidden transition-transform hover:scale-105"
                        >
                            <MessageSquare className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">{t('hero.cta_secondary')}</span>
                            <div className="absolute inset-0 bg-emerald-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-multiply" />
                        </button>

                        <div className="flex items-center gap-4 px-4 text-sm font-medium text-text-dim">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-void"></div>
                                <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-void"></div>
                                <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-void flex items-center justify-center text-xs text-white">1k+</div>
                            </div>
                            <p>{t('hero.no_registration')}</p>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Glassmorphism Interactive Mock */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative hidden lg:block"
                >
                    {/* The "Main Frame" */}
                    <div className="relative bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden ring-1 ring-white/5">

                        {/* Mock Header */}
                        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-deep flex items-center justify-center border border-emerald-glow/20">
                                    <BrainCircuit className="w-5 h-5 text-emerald-glow" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main text-sm">JauapAI Tutor</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-glow shadow-[0_0_8px_#10b981]"></span>
                                        <span className="text-xs text-text-muted">Online & Ready</span>
                                    </div>
                                </div>
                            </div>
                            <Command className="w-5 h-5 text-text-dim" />
                        </div>

                        {/* Mock Chat Stream */}
                        <div className="space-y-6 mb-8">
                            {/* User Bubble */}
                            <div className="flex justify-end">
                                <div className="bg-surface-highlight border border-white/5 text-text-main rounded-2xl rounded-tr-sm px-5 py-3 text-sm max-w-[85%] shadow-lg">
                                    {t('hero.mock_question')}
                                </div>
                            </div>

                            {/* AI Bubble */}
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0" />
                                <div className="space-y-2 max-w-[90%]">
                                    <div className="bg-emerald-deep/30 border border-emerald-glow/20 text-text-main rounded-2xl rounded-tl-sm px-5 py-4 text-sm shadow-lg backdrop-blur-sm">
                                        <p className="mb-3 text-emerald-100">{t('hero.mock_answer_intro')}</p>
                                        <div className="pl-3 border-l-2 border-emerald-glow/50 text-emerald-glow font-mono text-xs">
                                            {t('hero.mock_answer_detail')}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {['History', 'Math'].map(tag => (
                                            <span key={tag} className="text-[10px] uppercase font-bold text-text-dim bg-white/5 px-2 py-1 rounded">
                                                {tag} Source
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Input */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-glow to-teal-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative flex items-center bg-surface rounded-lg border border-white/10 p-1">
                                <input
                                    type="text"
                                    value={demoInput}
                                    onChange={(e) => setDemoInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleDemoSubmit()}
                                    placeholder={t('hero.input_placeholder')}
                                    className="flex-1 bg-transparent border-none text-sm text-text-main placeholder-text-dim focus:ring-0 px-4 py-3"
                                />
                                <button
                                    onClick={handleDemoSubmit}
                                    className="p-2 bg-emerald-glow/10 hover:bg-emerald-glow/20 text-emerald-glow rounded-md transition-colors"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Magic Chips */}
                        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-2">
                            {['hero.chips.math', 'hero.chips.history'].map((key) => (
                                <button
                                    key={key}
                                    onClick={() => navigate('/chat', { state: { initialMessage: t(key) } })}
                                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-text-muted hover:text-emerald-glow transition-all"
                                >
                                    {t(key)}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
