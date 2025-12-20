import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';


const Header = ({ transparent = false }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const textColor = 'text-white hover:text-indigo-200';
    const logoColor = 'text-white';
    // Use glass background if scrolled OR if not transparent mode. Transparent only at top.
    const headerBg = (transparent && !isScrolled)
        ? 'bg-transparent border-transparent'
        : 'bg-black/40 backdrop-blur-md border-white/10 shadow-lg';
    const titleColor = 'text-white';

    return (
        <header className={`fixed top-0 left-0 w-full z-50 border-b transition-colors ${headerBg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <GraduationCap className={`h-8 w-8 ${logoColor}`} />
                        <span className={`text-xl font-bold ${titleColor}`}>CampusCollab</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className={`${textColor} transition-colors text-sm font-bold uppercase tracking-wider`}>Features</a>
                        <a href="#showcase" className={`${textColor} transition-colors text-sm font-bold uppercase tracking-wider`}>Showcase</a>
                        <a href="#stats" className={`${textColor} transition-colors text-sm font-bold uppercase tracking-wider`}>Stats</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className={`${textColor} font-medium transition-colors`}
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Get Started
                        </Link>

                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
