import React from 'react';
import { MessageSquare, Users, FolderKanban, Zap, Globe, Shield } from 'lucide-react';

const features = [
    {
        icon: <Users className="h-6 w-6" />,
        title: "Find Teammates",
        description: "Connect with students who share your interests and have the skills your project needs."
    },
    {
        icon: <FolderKanban className="h-6 w-6" />,
        title: "Project Management",
        description: "Built-in tools to track progress, assign tasks, and keep your team organized."
    },
    {
        icon: <MessageSquare className="h-6 w-6" />,
        title: "Real-time Chat",
        description: "Seamless communication with your project members through instant messaging."
    },
    {
        icon: <Zap className="h-6 w-6" />,
        title: "Quick Setup",
        description: "Launch your project workspace in seconds with pre-configured templates."
    },
    {
        icon: <Globe className="h-6 w-6" />,
        title: "Showcase Work",
        description: "Display your portfolio and let others see what you've built."
    },
    {
        icon: <Shield className="h-6 w-6" />,
        title: "Secure Platform",
        description: "Your data and intellectual property are safe with our enterprise-grade security."
    }
];

const FeaturesSection = () => {
    return (
        <section id="features" className="py-24 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Everything you need to succeed</h2>
                    <p className="text-xl text-gray-300">
                        CampusCollab provides all the tools necessary to turn your innovative ideas into working products.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/15 transition-all group">
                            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
