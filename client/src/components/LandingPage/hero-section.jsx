import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Users, Rocket } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="pt-32 pb-20 overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 animate-fade-in-up">
                        <Rocket className="h-4 w-4" />
                        <span>The Future of Student Collaboration is Here</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
                        Build, Collaborate, and <br />
                        <span className="text-indigo-600 dark:text-indigo-400">Innovate Together</span>
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                        Connect with peers across disciplines, form dream teams, and turn your ambitious project ideas into reality. The ultimate platform for campus collaboration.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
                        >
                            Start Collaborating
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <a
                            href="#showcase"
                            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:border-gray-300 dark:hover:border-gray-600 flex items-center justify-center"
                        >
                            View Projects
                        </a>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12 hidden lg:block opacity-10 dark:opacity-20 pointer-events-none">
                    <Code2 className="h-64 w-64 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 hidden lg:block opacity-10 dark:opacity-20 pointer-events-none">
                    <Users className="h-64 w-64 text-indigo-600 dark:text-indigo-400" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
