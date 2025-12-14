import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Tag, Building2, ChevronRight, Loader2 } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await api.get('/projects');
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}!</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Here's what's happening in your network.</p>
                </div>
                <Link
                    to="/projects/new"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    New Project
                </Link>
            </div>

            <div className="relative max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
                </div>
            ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                        <div key={project._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full group">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1" title={project.title}>
                                        {project.title}
                                    </h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                                        Project
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                                    {project.summary}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.techStack.slice(0, 3).map(tech => (
                                        <div key={tech} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-300">
                                            <Tag className="w-3 h-3 mr-1 text-gray-400" />
                                            {tech}
                                        </div>
                                    ))}
                                    {project.techStack.length > 3 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            +{project.techStack.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 rounded-b-xl flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <Building2 className="w-4 h-4 mr-1.5 text-gray-400" />
                                    <span className="truncate max-w-[120px]">{project.university || 'University'}</span>
                                </div>
                                <Link
                                    to={`/projects/${project._id}`}
                                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
                                >
                                    View Details
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-dashed">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                        <Search className="h-full w-full" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new project.</p>
                    <div className="mt-6">
                        <Link
                            to="/create-project"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            New Project
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
