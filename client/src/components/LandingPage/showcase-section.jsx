import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
    {
        title: "EcoTrack",
        description: "A sustainable lifestyle tracking app built with React Native and Node.js.",
        tags: ["Mobile", "Sustainability", "React Native"],
        image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "CampusBuy",
        description: "Student marketplace for textbooks and furniture within campus.",
        tags: ["Web", "E-commerce", "MERN"],
        image: "/assets/images/campus_buy.png"
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
        <section id="showcase" className="py-24 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold text-white mb-4">Featured Projects</h2>
                        <p className="text-xl text-gray-300">
                            Check out some of the amazing projects built by students on CampusCollab.
                        </p>
                    </div>
                    <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 flex items-center gap-2">
                        View All Projects <ExternalLink className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-white/10 group">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/10 text-gray-300 text-xs font-medium rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div className="flex -space-x-2">
                                        {[
                                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
                                            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
                                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
                                        ].map((avatar, i) => (
                                            <img
                                                key={i}
                                                src={avatar}
                                                alt={`Collaborator ${i + 1}`}
                                                className="w-8 h-8 rounded-full border-2 border-transparent object-cover"
                                            />
                                        ))}
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
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
