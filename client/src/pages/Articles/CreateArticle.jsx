import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CreateArticle = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/articles', {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim())
            }, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            });
            navigate('/articles');
        } catch (error) {
            console.error("Error creating article", error);
            alert("Failed to create article");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8 pt-20 lg:pt-8 lg:pl-72">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Write an Article</h1>
                <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-white/10 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-white/20 dark:border-white/10 bg-white/50 dark:bg-black/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 backdrop-blur-sm transition-all"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                            <textarea
                                required
                                rows={10}
                                className="w-full px-4 py-2 rounded-lg border border-white/20 dark:border-white/10 bg-white/50 dark:bg-black/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 backdrop-blur-sm transition-all"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma separated)</label>
                            <input
                                type="text"
                                placeholder="react, design, tutorial"
                                className="w-full px-4 py-2 rounded-lg border border-white/20 dark:border-white/10 bg-white/50 dark:bg-black/40 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 backdrop-blur-sm transition-all"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/articles')}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading ? 'Publishing...' : 'Publish Article'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateArticle;
