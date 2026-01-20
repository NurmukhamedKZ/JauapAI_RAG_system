import { useLanguage } from '../context/LanguageContext';

const TrustedPublishers = () => {
    const { t } = useLanguage();

    // Using text placeholders styled as logos since we don't have actual SVG/PNGs yet
    const publishers = [
        { name: t('publishers.atamura'), color: 'text-blue-600' },
        { name: t('publishers.mektep'), color: 'text-red-600' },
        { name: t('publishers.armanpv'), color: 'text-green-600' },
        { name: t('publishers.almatykitap'), color: 'text-purple-600' }
    ];

    return (
        <section className="py-10 border-b border-white/5 bg-surface/30 backdrop-blur-sm">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-medium text-text-dim mb-8 uppercase tracking-wider">
                    {t('publishers.title')}
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 hover:opacity-100">
                    {publishers.map((pub, idx) => (
                        <div key={idx} className={`text-2xl font-bold text-white flex items-center gap-3`}>
                            {/* Icon placeholder */}
                            <div className="w-8 h-8 rounded-lg bg-emerald-glow/20 border border-emerald-glow/30"></div>
                            <span className="text-text-muted hover:text-white transition-colors">{pub.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedPublishers;
