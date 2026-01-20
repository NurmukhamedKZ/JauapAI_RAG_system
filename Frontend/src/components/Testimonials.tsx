import { useLanguage } from '../context/LanguageContext';
import { Star } from 'lucide-react';

const Testimonials = () => {
    const { t } = useLanguage();

    const testimonials = [
        { text: t('testimonials.item1.text'), author: t('testimonials.item1.author') },
        { text: t('testimonials.item2.text'), author: t('testimonials.item2.author') },
        { text: t('testimonials.item3.text'), author: t('testimonials.item3.author') },
    ];

    return (
        <section className="py-24 bg-void relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-heading text-text-main mb-6">
                        {t('testimonials.title')}
                    </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <div key={index} className="glass-card p-8 rounded-2xl hover:bg-surface/50 transition-colors group">
                            <div className="flex gap-1 text-emerald-400 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                ))}
                            </div>
                            <p className="text-text-main italic mb-8 text-lg leading-relaxed">"{item.text}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-deep to-emerald-glow flex items-center justify-center text-white font-bold text-sm">
                                    {item.author.charAt(0)}
                                </div>
                                <p className="font-bold text-text-muted group-hover:text-emerald-glow transition-colors">{item.author}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
