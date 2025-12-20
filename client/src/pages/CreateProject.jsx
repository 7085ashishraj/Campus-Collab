import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateProject = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const formattedData = {
                ...data,
                tags: (data.tags || '').split(',').map(tag => tag.trim()).filter(Boolean),
                techStack: (data.techStack || '').split(',').map(tech => tech.trim()).filter(Boolean),
            };
            await api.post('/projects', formattedData);
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to create project", error);
            alert("Failed to create project. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <Link to="/dashboard" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Project</h1>
                <p className="text-gray-600 dark:text-gray-400">Share your idea with the campus community.</p>
            </div>

            <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Title</label>
                        <input
                            type="text"
                            {...register('title', { required: 'Title is required' })}
                            className="block w-full rounded-lg border-white/20 dark:border-white/10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 bg-white/50 dark:bg-black/40 dark:text-white dark:placeholder-gray-400 placeholder-gray-500 backdrop-blur-sm transition-all"
                            placeholder="e.g. AI Study Companion"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">A short tagline for project cards (max 150 chars)</p>
                        <textarea
                            {...register('summary', { required: 'Summary is required', maxLength: 150 })}
                            className="block w-full rounded-lg border-white/20 dark:border-white/10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white/50 dark:bg-black/40 dark:text-white dark:placeholder-gray-400 placeholder-gray-500 backdrop-blur-sm transition-all"
                            rows="2"
                            placeholder="Build teams, find projects, and collaborate across campus."
                        ></textarea>
                        {errors.summary && <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Description</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Detailed explanation of the project. Markdown supported.</p>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            className="block w-full rounded-lg border-white/20 dark:border-white/10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono text-sm bg-white/50 dark:bg-black/40 dark:text-white dark:placeholder-gray-400 placeholder-gray-500 backdrop-blur-sm transition-all"
                            rows="8"
                            placeholder="## Project Goals&#10;- Goal 1&#10;- Goal 2"
                        ></textarea>
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">University</label>
                            <input
                                type="text"
                                {...register('university', { required: 'University is required' })}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="Stanford University"
                            />
                            {errors.university && <p className="mt-1 text-sm text-red-600">{errors.university.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibility</label>
                            <select
                                {...register('visibility')}
                                className="block w-full rounded-lg border-white/20 dark:border-white/10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 bg-white/50 dark:bg-black/40 dark:text-white backdrop-blur-sm transition-all"
                            >
                                <option value="public">Public (Everyone)</option>
                                <option value="university">University Only</option>
                                <option value="private">Private (Invite Only)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tech Stack</label>
                        <input
                            type="text"
                            {...register('techStack')}
                            placeholder="React, Node.js, TensorFlow"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Separate technologies with commas</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                        <input
                            type="text"
                            {...register('tags')}
                            placeholder="Education, Machine Learning, Social"
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Keywords to help others find your project</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                        <Link
                            to="/dashboard"
                            className="px-4 py-2 border border-white/20 dark:border-white/10 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 backdrop-blur-sm transition-all"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="-ml-1 mr-2 h-4 w-4" />
                                    Create Project
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;
