import React from 'react';
import bgVideo from '../assets/bg.mp4';
import Header from '../components/LandingPage/header';
import HeroSection from '../components/LandingPage/hero-section';
import FeaturesSection from '../components/LandingPage/features-section';
import StatsSection from '../components/LandingPage/stats-section';
import ShowcaseSection from '../components/LandingPage/showcase-section';
import CTASection from '../components/LandingPage/cta-section';
import Footer from '../components/LandingPage/footer';

const Landing = () => {
    return (
        <div className="min-h-screen relative overflow-hidden font-sans text-white">
            {/* Global Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="fixed inset-0 w-full h-full object-cover z-0"
            >
                <source src={bgVideo} type="video/mp4" />
            </video>
            {/* Global Overlay */}
            <div className="fixed inset-0 bg-black/60 z-0"></div>

            <div className="relative z-10 text-gray-100">
                <Header transparent={true} />
                <main>
                    <HeroSection />
                    <StatsSection />
                    <FeaturesSection />
                    <ShowcaseSection />
                    <CTASection />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Landing;
