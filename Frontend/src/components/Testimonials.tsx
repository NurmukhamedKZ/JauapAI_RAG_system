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
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-text-dark">{t('testimonials.title')}</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex gap-1 text-yellow-500 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-700 italic mb-6 text-lg">"{item.text}"</p>
                            <p className="font-bold text-text-dark">{item.author}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
