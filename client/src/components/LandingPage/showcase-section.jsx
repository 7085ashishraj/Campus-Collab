import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
    {
        title: "EcoTrack",
        description: "A sustainable lifestyle tracking app built with React Native and Node.js.",
        tags: ["Mobile", "Sustainability", "React Native"],
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
    },
    {
        title: "CampusBuy",
        description: "Student marketplace for textbooks and furniture within campus.",
        tags: ["Web", "E-commerce", "MERN"],
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=800&q=80"
    },
    {
        title: "StudyBuddy",
        description: "AI-powered study group matcher based on courses and learning styles.",
        tags: ["AI", "Education", "Python"],
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
    }
];

const ShowcaseSection = () => {
    return (
        <section id="showcase" className="py-24 bg-gray-50 dark:bg-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Projects</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Check out some of the amazing projects built by students on CampusCollab.
                        </p>
                    </div>
                    <button className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-2">
                        View All Projects <ExternalLink className="h-4 w-4" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div key={index} className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-600 group">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-600">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-500 border-2 border-white dark:border-gray-700" />
                                        ))}
                                    </div>
                                    <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        <Github className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShowcaseSection;
