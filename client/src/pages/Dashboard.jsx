import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Search } from 'lucide-react';

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
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
                <Link to="/create-project" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Project
                </Link>
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search projects by title or tech stack..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {loading ? (
                <p>Loading projects...</p>
            ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                        <div key={project._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">{project.summary}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.techStack.map(tech => (
                                    <span key={tech} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                            <div className="flex justify-between items-center border-t pt-4">
                                <span className="text-sm text-gray-500">{project.university}</span>
                                <Link to={`/projects/${project._id}`} className="text-blue-600 hover:underline text-sm font-medium">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-10">No projects found. Start by creating one!</p>
            )}
        </div>
    );
};

export default Dashboard;
