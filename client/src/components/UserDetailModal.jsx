import { X, Mail, Award, Github, MessageSquare } from 'lucide-react';
import { useChat } from '../context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const UserDetailModal = ({ user, onClose, isOpen }) => {
    const { setSelectedChat, chats, setChats } = useChat();
    const navigate = useNavigate();

    if (!isOpen || !user) return null;

    const accessChat = async () => {
        try {
            const { data } = await api.post(`/chat`, { userId: user._id });

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            onClose();
            navigate("/chats");
        } catch (error) {
            console.error("Error creating chat", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl w-[90%] max-w-sm relative overflow-hidden transform transition-all scale-100 hover:scale-[1.02]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header/Banner Area */}
                <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                            alt={user.name}
                            className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="pt-12 pb-6 px-6 text-center">
                    <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-sm text-gray-500 mb-4">{user.university || "University Member"}</p>

                    <div className="flex justify-center space-x-3 mb-6">
                        {user.githubId && (
                            <a href={`https://github.com/${user.githubId}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 hover:text-black transition">
                                <Github className="w-5 h-5" />
                            </a>
                        )}
                        <a href={`mailto:${user.email}`} className="p-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 hover:text-black transition">
                            <Mail className="w-5 h-5" />
                        </a>
                        <button onClick={accessChat} className="p-2 bg-blue-100 rounded-full text-blue-700 hover:bg-blue-200 transition">
                            <MessageSquare className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-3 text-left bg-gray-50 rounded-lg p-4 mb-2">
                        {user.bio && (
                            <p className="text-gray-600 text-sm italic border-l-2 border-blue-400 pl-3 mb-3">"{user.bio}"</p>
                        )}

                        {/* The mail icon and email span are now handled by the buttons above, but keeping this for consistency if other details are here */}
                        {/* <div className="flex items-center text-gray-700 text-sm">
                            <Mail className="w-4 h-4 mr-2.5 text-blue-500" />
                            <span className="truncate">{user.email}</span>
                        </div> */}

                        {user.skills && user.skills.length > 0 && (
                            <div className="pt-2">
                                <div className="flex items-center text-gray-700 text-sm mb-2">
                                    <Award className="w-4 h-4 mr-2.5 text-blue-500" />
                                    <span className="font-semibold">Skills</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pl-6">
                                    {user.skills.map((skill, index) => (
                                        <span key={index} className="bg-white border border-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
