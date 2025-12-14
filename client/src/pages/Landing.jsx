import React from 'react';
import Header from '../components/LandingPage/header';
import HeroSection from '../components/LandingPage/hero-section';
import FeaturesSection from '../components/LandingPage/features-section';
import StatsSection from '../components/LandingPage/stats-section';
import ShowcaseSection from '../components/LandingPage/showcase-section';
import CTASection from '../components/LandingPage/cta-section';
import Footer from '../components/LandingPage/footer';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Header />
            <main>
                <HeroSection />
                <StatsSection />
                <FeaturesSection />
                <ShowcaseSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default Landing;
