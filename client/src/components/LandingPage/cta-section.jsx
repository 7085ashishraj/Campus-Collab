import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
    return (
        <section className="py-24 bg-transparent border-t border-white/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold text-white mb-6">Ready to start your journey?</h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                    Join thousands of students who are already collaborating, learning, and building amazing things together.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/register"
                        className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
                    >
                        Sign up for free
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                        to="/login"
                        className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                    >
                        I already have an account
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
