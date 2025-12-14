import { useState, useEffect } from 'react';
import { X, Save, Github, Mail, User, BookOpen, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const ProfileModal = ({ onClose }) => {
    const { user, login } = useAuth(); // We might need a way to update the user in context without full login, but login updates state.
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
            // Convert skills string to array
            const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill !== '');

            const updateData = {
                ...formData,
                skills: skillsArray
            };

            // Remove password if empty to avoid sending empty string
            if (!updateData.password) {
                delete updateData.password;
                delete updateData.confirmPassword; // Not sent to backend anyway usually, but clean up
            }

            const { data } = await api.put('/auth/profile', updateData);

            // Update auth context
            // Assuming login function takes (userData, token) or just userData if we overload it, 
            // or we might need to manually update localStorage and state. 
            // The authContext logic typically stores user in state. 
            // If the login function expects just the user object or response to set state:
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const newUser = { ...currentUser, ...data };
            localStorage.setItem('user', JSON.stringify(newUser));

            setMessage({ type: 'success', text: 'Profile updated successfully' });

            // Delay reload to let user see success message
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error("Profile update error:", error);
            // Show detailed error message if available
            // Show detailed error message if available
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h2>

                    {message && (
                        <div className={`p-3 rounded mb-4 text-sm ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="university"
                                    value={formData.university}
                                    onChange={handleChange}
                                    className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="3"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Tell us about yourself..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                            <div className="relative">
                                <Award className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="React, Node.js, Python..."
                                    className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub ID (Optional)</label>
                            <div className="relative">
                                <Github className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="githubId"
                                    value={formData.githubId}
                                    onChange={handleChange}
                                    placeholder="your-github-username"
                                    className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h3 className="text-sm font-semibold text-gray-800 mb-3">Change Password</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
