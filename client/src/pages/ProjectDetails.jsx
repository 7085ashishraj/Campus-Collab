import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import {
    Download,
    UserPlus,
    Mail,
    Calendar,
    FileText,
    Upload,
    Check,
    X,
    MessageSquare,
    ArrowLeft,
    Clock,
    MoreVertical,
    Share2,
    Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatProvider';
import UserDetailModal from '../components/UserDetailModal';
import { Link } from 'react-router-dom';

const ProjectDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const { setSelectedChat, chats, setChats } = useChat();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data } = await api.get(`/projects/${id}`);
                setProject(data);
                if (user && data.owner._id === user._id) {
                    fetchRequests();
                }
            } catch (error) {
                console.error("Error fetching project", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, user]);

    const fetchRequests = async () => {
        try {
            // Check if endpoint exists, otherwise this might 404
            // Assuming the previous code had this working
            const { data } = await api.get(`/projects/${id}/collaboration-requests`);
            setRequests(data.filter(req => req.status === 'pending'));
        } catch (error) {
            // Silence error if feature not fully implemented on backend for this path
            console.warn("Could not fetch requests", error);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const response = await api.get(`/projects/${id}/pdf`, { responseType: 'blob' });
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

    const handleRequestCollaboration = async () => {
        const message = prompt("Why do you want to collaborate?");
        if (message !== null) {
            try {
                const { data } = await api.post(`/projects/${id}/collaboration-request`, { message });
                alert(data.message);
            } catch (error) {
                alert("Failed to send request: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleRespondToRequest = async (requestId, status) => {
        try {
            const { data } = await api.put(`/projects/${id}/collaboration-request/${requestId}`, { status });
            alert(data.message);
            fetchRequests();
        } catch (error) {
            alert("Failed to respond to request: " + (error.response?.data?.message || error.message));
        }
    };

    const handleTeamChat = async () => {
        if (!project.collaborators || project.collaborators.length === 0) {
            alert("You need at least one collaborator to start a team chat.");
            return;
        }

        const userList = JSON.stringify(project.collaborators.map(c => c._id));

        try {
            const { data } = await api.post(`/chat/group`, {
                name: project.title,
                users: userList,
                projectId: project._id
            });

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            navigate("/chats");
        } catch (error) {
            alert("Failed to access team chat");
            console.error(error);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const { data } = await api.post(`/projects/${id}/files`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProject(prev => ({ ...prev, files: [...prev.files, data] }));
            alert("File uploaded successfully");
        } catch (error) {
            alert("Failed to upload file: " + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
        </div>
    );

    if (!project) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project not found</h2>
            <Link to="/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 mt-4 inline-block">Return to Dashboard</Link>
        </div>
    );

    const isOwner = user && user._id === project.owner._id;
    const isCollaborator = user && project.collaborators && (project.collaborators.some(c => c._id === user._id) || project.collaborators.includes(user._id));

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <Link to="/dashboard" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                </Link>
                <div className="flex items-center gap-3">
                    {/* Actions Menu could go here */}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-8 py-10 text-white relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white tracking-tight">{project.title}</h1>
                                <div className="flex items-center gap-4 text-indigo-100">
                                    <span className="flex items-center gap-1.5 text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                        <Share2 className="w-3.5 h-3.5" />
                                        {project.visibility}
                                    </span>
                                    <span className="text-sm font-medium">{project.university}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {isOwner && (
                                    <button onClick={handleInvite} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all text-sm font-medium border border-white/20">
                                        <UserPlus className="w-4 h-4" />
                                        Invite
                                    </button>
                                )}
                                {!isOwner && !isCollaborator && (
                                    <button onClick={handleRequestCollaboration} className="flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg shadow-lg transition-all text-sm font-bold">
                                        <UserPlus className="w-4 h-4" />
                                        Join Project
                                    </button>
                                )}
                                <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all text-sm font-medium border border-white/20">
                                    <Download className="w-4 h-4" />
                                    PDF
                                </button>
                                {(isOwner || isCollaborator) && (
                                    <button onClick={handleTeamChat} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all text-sm font-bold border border-emerald-400">
                                        <MessageSquare className="w-4 h-4" />
                                        Team Chat
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700">
                    {/* Main Content */}
                    <div className="lg:col-span-2 p-8">
                        <section className="mb-10">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                About this Project
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">{project.summary}</p>
                            <div className="prose prose-indigo dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                {project.description}
                            </div>
                        </section>

                        {/* Files Section */}
                        {(isOwner || isCollaborator) && (
                            <section className="mb-10">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        Project Files
                                    </h2>
                                    <div>
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 cursor-pointer transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {uploading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}
                                            {uploading ? 'Uploading...' : 'Upload New'}
                                        </label>
                                    </div>
                                </div>

                                {project.files && project.files.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {project.files.map(file => (
                                            <a
                                                key={file._id}
                                                href={`http://localhost:5000${file.path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-start p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm transition-all group"
                                            >
                                                <div className="p-2 bg-gray-50 dark:bg-gray-600 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-gray-500 transition-colors mr-3">
                                                    <FileText className="w-5 h-5 text-gray-500 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-700 dark:group-hover:text-indigo-300">{file.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        {new Date(file.uploadedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">No files shared yet.</p>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Requests Section for Owner */}
                        {isOwner && requests.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    Pending Requests
                                </h2>
                                <div className="space-y-3">
                                    {requests.map(req => req.user && (
                                        <div key={req._id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                                                    {req.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{req.user.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">"{req.message}"</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleRespondToRequest(req._id, 'accepted')}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                                    title="Accept"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleRespondToRequest(req._id, 'rejected')}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Reject"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar Info */}
                    <div className="lg:col-span-1 bg-gray-50/50 dark:bg-gray-800/50 p-8 space-y-8">
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Owner</h3>
                            <div className="flex items-center gap-3">
                                <img
                                    src={project.owner.avatar || `https://ui-avatars.com/api/?name=${project.owner.name}&background=random`}
                                    alt={project.owner.name}
                                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{project.owner.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{project.owner.email}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map(tech => (
                                    <span key={tech} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Project Team</h3>
                            <div className="space-y-3">
                                {project.collaborators && project.collaborators.length > 0 ? (
                                    project.collaborators.map(collab => (
                                        <div
                                            key={collab._id}
                                            onClick={() => setSelectedUser(collab)}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition"
                                        >
                                            <img
                                                src={collab.avatar || `https://ui-avatars.com/api/?name=${collab.name}&background=random`}
                                                alt={collab.name}
                                                className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600"
                                            />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{collab.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">No collaborators yet</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <Calendar className="w-4 h-4 mr-2.5 text-gray-400" />
                                    <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <Clock className="w-4 h-4 mr-2.5 text-gray-400" />
                                    <span>Last updated recently</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    isOpen={!!selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
};

export default ProjectDetails;
