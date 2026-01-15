

import Header from './components/Header';
import Hero from './components/Hero';
import FeatureCards from './components/FeatureCards';
import CoreFeatures from './components/CoreFeatures';
import Benchmarks from './components/Benchmarks';

import CTASection from './components/CTASection';
import Footer from './components/Footer';

import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <div className="bg-bg-light min-h-screen font-sans selection:bg-hero-1/20 selection:text-text-dark">
        <Header />
        <main>
          <Hero />
          <FeatureCards />
          <CoreFeatures />
          <Benchmarks />

          <CTASection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
