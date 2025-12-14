import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

const Header = () => {
    return (
        <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-indigo-600" />
                        <span className="text-xl font-bold text-gray-900">CampusCollab</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#showcase" className="text-gray-600 hover:text-indigo-600 transition-colors">Showcase</a>
                        <a href="#stats" className="text-gray-600 hover:text-indigo-600 transition-colors">Stats</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            Get Started
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
