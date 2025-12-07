import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        try {
            // Convert skills string to array if needed
            const formattedData = {
                ...data,
                skills: data.skills.split(',').map(skill => skill.trim())
            };
            await registerUser(formattedData);
            navigate('/dashboard');
        } catch (error) {
            setServerError(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
            {serverError && <div className="text-red-500 mb-4 text-center">{serverError}</div>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input type="text" {...register('name', { required: 'Name is required' })} className="w-full border rounded px-3 py-2 mt-1" />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input type="email" {...register('email', { required: 'Email is required' })} className="w-full border rounded px-3 py-2 mt-1" />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>
                <div>
                    <label className="block text-gray-700">Password</label>
                    <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })} className="w-full border rounded px-3 py-2 mt-1" />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>
                <div>
                    <label className="block text-gray-700">University</label>
                    <input type="text" {...register('university', { required: 'University is required' })} className="w-full border rounded px-3 py-2 mt-1" />
                </div>
                <div>
                    <label className="block text-gray-700">Skills (comma separated)</label>
                    <input type="text" {...register('skills')} placeholder="React, Node.js, Python" className="w-full border rounded px-3 py-2 mt-1" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Register
                </button>
            </form>
            <p className="mt-4 text-center text-sm">
                Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
            </p>
        </div>
    );
};

export default Register;
