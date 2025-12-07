import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const CreateProject = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const formattedData = {
                ...data,
                tags: data.tags.split(',').map(tag => tag.trim()),
                techStack: data.techStack.split(',').map(tech => tech.trim()),
            };
            await api.post('/projects', formattedData);
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to create project", error);
            alert("Failed to create project");
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-gray-700 mb-2">Project Title</label>
                    <input type="text" {...register('title', { required: true })} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Summary (Short description)</label>
                    <textarea {...register('summary', { required: true })} className="w-full border rounded px-3 py-2" rows="2"></textarea>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Full Description (Markdown supported)</label>
                    <textarea {...register('description', { required: true })} className="w-full border rounded px-3 py-2" rows="6"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-2">University</label>
                        <input type="text" {...register('university', { required: true })} className="w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Visibility</label>
                        <select {...register('visibility')} className="w-full border rounded px-3 py-2">
                            <option value="public">Public</option>
                            <option value="university">University Only</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Tech Stack (comma separated)</label>
                    <input type="text" {...register('techStack')} placeholder="React, Express, MongoDB" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Tags (comma separated)</label>
                    <input type="text" {...register('tags')} placeholder="Education, Social, Web App" className="w-full border rounded px-3 py-2" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-medium">
                    Create Project
                </button>
            </form>
        </div>
    );
};

export default CreateProject;
