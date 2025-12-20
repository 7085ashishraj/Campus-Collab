import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Twitter, Github, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black/40 backdrop-blur-md pt-20 pb-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <GraduationCap className="h-8 w-8 text-indigo-400" />
                            <span className="text-xl font-bold text-white">CampusCollab</span>
                        </Link>
                        <p className="text-gray-400 max-w-md leading-relaxed mb-6">
                            Empowering students to connect, collaborate, and create the future. The #1 platform for campus project management and team formation.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://github.com/7085ashishraj/Campus-Collab" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-indigo-400 transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="https://www.linkedin.com/in/ashish-raj-47a120277/" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-indigo-400 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">Platform</h4>
                        <ul className="space-y-4">
                            <li><a href="#features" className="text-gray-400 hover:text-indigo-400 transition-colors">Features</a></li>
                            <li><a href="#showcase" className="text-gray-400 hover:text-indigo-400 transition-colors">Showcase</a></li>
                            <li><a href="#stats" className="text-gray-400 hover:text-indigo-400 transition-colors">Community</a></li>
                            <li><Link to="/login" className="text-gray-400 hover:text-indigo-400 transition-colors">Sign In</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Guidelines</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>&copy; 2024 CampusCollab. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
