import { useState, useEffect } from 'react';
import { X, Save, Github, Mail, User, BookOpen, Award, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const ProfileModal = ({ onClose }) => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        university: '',
        bio: '',
        skills: '',
        githubId: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                university: user.university || '',
                bio: user.bio || '',
                skills: user.skills ? user.skills.join(', ') : '',
                githubId: user.githubId || '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(Boolean);

            const updateData = {
                ...formData,
                skills: skillsArray
            };

            if (!updateData.password) {
                delete updateData.password;
                delete updateData.confirmPassword;
            }

            const { data } = await api.put('/auth/profile', updateData);

            const currentUser = JSON.parse(localStorage.getItem('user'));
            const newUser = { ...currentUser, ...data };
            localStorage.setItem('user', JSON.stringify(newUser));

            setMessage({ type: 'success', text: 'Profile updated successfully' });

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error("Profile update error:", error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Update failed';

            if (error.response?.status === 401) {
                setMessage({ type: 'error', text: 'Session expired. Please log out and log in again.' });
            } else {
                setMessage({ type: 'error', text: errorMessage });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-gray-900/5 dark:ring-white/10 border border-white/20 dark:border-white/10">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/20 dark:border-white/10 flex items-center justify-between bg-white/10 dark:bg-white/5 backdrop-blur-xl">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-transparent hover:bg-white/20 dark:hover:bg-white/10 rounded-full transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                    {message && (
                        <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium animate-slide-in ${message.type === 'error'
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30'
                            : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="block w-full pl-10 px-3 py-2.5 bg-white/50 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm backdrop-blur-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full pl-10 px-3 py-2.5 bg-white/50 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm backdrop-blur-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">University</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <BookOpen className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="university"
                                    value={formData.university}
                                    onChange={handleChange}
                                    className="block w-full pl-10 px-3 py-2.5 bg-white/50 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="3"
                                className="block w-full px-4 py-3 bg-white/50 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm resize-none backdrop-blur-sm"
                                placeholder="Tell us a bit about yourself..."
                            ></textarea>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Award className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="React, Node.js, Python (comma separated)"
                                    className="block w-full pl-10 px-3 py-2.5 bg-white/50 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Github className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="githubId"
                                    value={formData.githubId}
                                    onChange={handleChange}
                                    placeholder="username"
                                    className="block w-full pl-10 px-3 py-2.5 bg-white/50 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-indigo-500" />
                                Security
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full px-3 py-2.5 bg-white/50 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm backdrop-blur-sm"
                                        placeholder="Leave blank to keep"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="block w-full px-3 py-2.5 bg-white/50 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm backdrop-blur-sm"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="px-6 py-4 bg-white/20 dark:bg-white/5 border-t border-white/20 dark:border-white/10 flex justify-end gap-3 z-10 backdrop-blur-sm">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-white/10 border border-white/20 dark:border-white/10 rounded-xl hover:bg-white/70 dark:hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all backdrop-blur-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-lg shadow-indigo-500/30 disabled:opacity-75 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
