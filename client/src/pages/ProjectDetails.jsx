import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Download, UserPlus, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data } = await api.get(`/projects/${id}`);
                setProject(data);
            } catch (error) {
                console.error("Error fetching project", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    const handleDownloadPDF = async () => {
        try {
            const response = await api.get(`/projects/${id}/pdf`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${project.title}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading PDF", error);
            alert("Failed to download PDF");
        }
    };

    const handleInvite = async () => {
        const email = prompt("Enter email to invite:");
        if (email) {
            try {
                const { data } = await api.post(`/projects/${id}/invite`, { email });
                alert(data.message);
            } catch (error) {
                alert("Failed to invite: " + (error.response?.data?.message || error.message));
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found</div>;

    const isOwner = user && user._id === project.owner._id;

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 p-8 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
                        <p className="text-blue-100 text-lg">{project.university}</p>
                    </div>
                    <div className="flex space-x-3">
                        {isOwner && (
                            <button onClick={handleInvite} className="flex items-center bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">
                                <UserPlus className="w-5 h-5 mr-2" />
                                Invite
                            </button>
                        )}
                        <button onClick={handleDownloadPDF} className="flex items-center bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition border border-blue-500">
                            <Download className="w-5 h-5 mr-2" />
                            PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">About</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">{project.summary}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Description</h3>
                        {/* In a real app, use a markdown renderer here */}
                        <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                            {project.description}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Details</h3>
                        <div className="space-y-3">
                            <div className="flex items-center text-gray-600">
                                <UserPlus className="w-5 h-5 mr-3" />
                                <span>Owner: {project.owner.name}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Mail className="w-5 h-5 mr-3" />
                                <span>{project.owner.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Calendar className="w-5 h-5 mr-3" />
                                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map(tech => (
                                <span key={tech} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
