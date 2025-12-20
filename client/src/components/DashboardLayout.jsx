import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

import { Menu, X } from 'lucide-react';
import { GraduationCap } from 'lucide-react';

import bgVideo from '../assets/bg.mp4';

const DashboardLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen relative transition-colors">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="fixed inset-0 w-full h-full object-cover -z-20"
            >
                <source src={bgVideo} type="video/mp4" />
            </video>
            {/* Overlay for readability - keeping it fairly opaque so content pops but video provides ambience */}
            {/* Overlay for readability - lighter touch for more vibrance */}
            <div className="fixed inset-0 bg-gray-50/30 dark:bg-black/40 -z-10" />
            {/* Mobile Header */}
            <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white">CampusCollab</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <Sidebar />

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-30">
                    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl animate-slide-in">
                        <div className="h-full relative z-50">
                            <Sidebar isMobile={true} onLinkClick={() => setIsMobileMenuOpen(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="lg:pl-64 min-h-screen pt-4 lg:pt-0">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
