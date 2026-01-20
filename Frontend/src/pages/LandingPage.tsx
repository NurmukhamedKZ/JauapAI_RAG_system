import Header from '../components/Header';
import Hero from '../components/Hero';
import FeatureCards from '../components/FeatureCards';
import HowItWorks from '../components/HowItWorks';
import CoreFeatures from '../components/CoreFeatures';
import Benchmarks from '../components/Benchmarks';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import TrustedPublishers from '../components/TrustedPublishers';
import Testimonials from '../components/Testimonials';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
    const { t } = useLanguage();

    // Schema Markup for Educational Application
    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "JauapAI",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "KZT"
        },
        "description": t('meta.description')
    };

    const navigate = useNavigate();

    return (

        <div className="bg-void min-h-screen font-sans selection:bg-emerald-glow/30 selection:text-white pb-20 md:pb-0">
            <Helmet>
                <title>{t('meta.title')}</title>
                <meta name="description" content={t('meta.description')} />
                <meta property="og:title" content={t('meta.title')} />
                <meta property="og:description" content={t('meta.description')} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://jauapai.kz" />
                {/* <meta property="og:image" content="..." /> TODO: Add image */}
                <script type="application/ld+json">
                    {JSON.stringify(schemaMarkup)}
                </script>
            </Helmet>
            <Header />
            <main>
                <Hero />
                <TrustedPublishers />
                <FeatureCards />
                <HowItWorks />
                <CoreFeatures />
                <Benchmarks />
                <Testimonials />
                <CTASection />
            </main>
            <Footer />

            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-void/80 backdrop-blur-xl border-t border-white/10 md:hidden z-50">
                <button
                    onClick={() => navigate('/chat')}
                    className="w-full bg-emerald-glow text-void font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 animate-pulse-slow active:scale-95 transition-transform"
                >
                    <MessageSquare className="w-5 h-5" />
                    {t('hero.cta_secondary')}
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
