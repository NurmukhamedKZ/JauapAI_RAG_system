import { useLanguage } from '../context/LanguageContext';

const TrustedPublishers = () => {
    const { t } = useLanguage();

    // Using text placeholders styled as logos since we don't have actual SVG/PNGs yet
    const publishers = [
        { name: 'Atamura', color: 'text-blue-600' },
        { name: 'Mektep', color: 'text-red-600' },
        { name: 'Arman-PV', color: 'text-green-600' },
        { name: 'Almaty Kitap', color: 'text-purple-600' }
    ];

    return (
        <section className="py-10 border-b border-gray-100 bg-white">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">
                    {t('publishers.title')}
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {publishers.map((pub, idx) => (
                        <div key={idx} className={`text-2xl font-bold ${pub.color} flex items-center gap-2`}>
                            {/* Icon placeholder */}
                            <div className="w-8 h-8 rounded bg-current opacity-20"></div>
                            {pub.name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedPublishers;
