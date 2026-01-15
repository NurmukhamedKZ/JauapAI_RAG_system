

import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10 relative overflow-hidden">
            {/* Subtle gradient bleed */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-bg-light to-transparent opacity-50 pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <span className="text-2xl font-bold bg-gradient-to-r from-hero-1 to-hero-2 bg-clip-text text-transparent mb-6 block">
                            JauapAI
                        </span>
                        <p className="text-muted text-sm leading-relaxed mb-6">
                            {t('footer.desc')}
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-bg-light flex items-center justify-center text-text-dark hover:bg-hero-1 hover:text-white transition-all duration-300">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {[
                        {
                            title: t('footer.product'),
                            links: ["Features", "Pricing", "Testimonials", "API"] // Keeping generic for now or need nested translation keys
                        },
                        {
                            title: t('footer.resources'),
                            links: ["Documentation", "Community", "Help Center", "Blog"]
                        },
                        {
                            title: t('footer.company'),
                            links: ["About Us", "Careers", "Legal", "Contact"]
                        }
                    ].map((col, idx) => (
                        <div key={idx}>
                            <h4 className="font-bold text-text-dark mb-6">{col.title}</h4>
                            <ul className="space-y-4">
                                {col.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <a href="#" className="text-muted hover:text-hero-1 transition-colors text-sm">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted">
                    <p>© {new Date().getFullYear()} JauapAI. {t('footer.rights')}</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-text-dark transition-colors">{t('footer.privacy')}</a>
                        <a href="#" className="hover:text-text-dark transition-colors">{t('footer.terms')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
