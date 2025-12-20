import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Users, Rocket } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
            {/* Removed local video and overlay to use global one from Landing.jsx */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 animate-fade-in-up">
                        <Rocket className="h-4 w-4" />
                        <span>The Future of Student Collaboration is Here</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                        Build, Collaborate, and <br />
                        <span className="text-indigo-600 dark:text-indigo-400">Innovate Together</span>
                    </h1>

                    <p className="text-xl text-gray-200 mb-10 leading-relaxed">
                        Connect with peers across disciplines, form dream teams, and turn your ambitious project ideas into reality. The ultimate platform for campus collaboration.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
                        >
                            Start Collaborating
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <a
                            href="#showcase"
                            className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center"
                        >
                            View Projects
                        </a>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-4 lg:left-10 -translate-y-1/2 hidden lg:block opacity-10 dark:opacity-10 pointer-events-none">
                    <Code2 className="h-32 w-32 lg:h-48 lg:w-48 text-indigo-600 dark:text-indigo-400/50 rotate-12" />
                </div>
                <div className="absolute top-1/2 right-4 lg:right-10 -translate-y-1/2 hidden lg:block opacity-10 dark:opacity-10 pointer-events-none">
                    <Users className="h-32 w-32 lg:h-48 lg:w-48 text-indigo-600 dark:text-indigo-400/50 -rotate-12" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
